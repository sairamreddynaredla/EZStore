const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const FILE = path.join(ROOT, "src", "data", "breeds.js");
const BACKUP = path.join(__dirname, `breeds.js.bak.${Date.now()}`);

const fieldsToRemove = [
  "tabs",
  "nutrition",
  "grooming",
  "training",
  "puppyCare",
  "lifestyle",
  "funFacts",
  "faqs",
  "relatedBreeds",
];

function findArrayBounds(src, fromIndex) {
  const len = src.length;
  let i = fromIndex;
  // find first '['
  while (i < len && src[i] !== "[") i++;
  if (i >= len) return null;
  let open = 0;
  let inSq = false;
  let inDQ = false;
  let inSQ = false;
  let inBT = false;
  let escaped = false;
  for (let j = i; j < len; j++) {
    const ch = src[j];
    if (!escaped) {
      if (ch === '"' && !inSQ && !inBT) inDQ = !inDQ;
      else if (ch === "'" && !inDQ && !inBT) inSQ = !inSQ;
      else if (ch === "`" && !inDQ && !inSQ) inBT = !inBT;
      else if (!inDQ && !inSQ && !inBT) {
        if (ch === "[") open++;
        else if (ch === "]") {
          open--;
          if (open === 0) return { start: i, end: j };
        }
      }
    }
    escaped = !escaped && ch === "\\";
  }
  return null;
}

try {
  const src = fs.readFileSync(FILE, "utf8");
  fs.writeFileSync(BACKUP, src, "utf8");
  console.log("Backup created:", BACKUP);

  // capture import var -> path
  const importRegex = /^import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/gm;
  const imports = {};
  let cleaned = src.replace(importRegex, (m, name, p) => {
    imports[name] = p;
    return "";
  });

  // replace imported variable references with their path string
  Object.keys(imports).forEach((name) => {
    const p = imports[name];
    // replace word occurrences
    const re = new RegExp("\\b" + name + "\\b", "g");
    cleaned = cleaned.replace(re, JSON.stringify(p));
  });

  const idx = cleaned.indexOf("const breedData");
  if (idx === -1) throw new Error("const breedData not found");
  const bounds = findArrayBounds(cleaned, idx);
  if (!bounds) throw new Error("Could not locate top-level breedData array");
  const arrayText = cleaned.slice(bounds.start, bounds.end + 1);

  // Evaluate the array safely
  const script = new vm.Script("(" + arrayText + ")");
  const breedData = script.runInNewContext({});

  if (!Array.isArray(breedData)) throw new Error("Parsed breedData is not an array");

  // remove fields
  breedData.forEach((b) => {
    fieldsToRemove.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(b, f)) delete b[f];
    });
  });

  // Build new file content: keep a small header and export
  const header = `// This file was cleaned by scripts/removeBreedFieldsAst.cjs\n// Backup created at: ${path.relative(ROOT, BACKUP)}\n\n`;
  const newContent =
    header +
    "const breedData = " +
    JSON.stringify(breedData, null, 2) +
    ";\n\nexport default breedData;\n";
  fs.writeFileSync(FILE, newContent, "utf8");
  console.log("Wrote cleaned", FILE);
} catch (err) {
  console.error("Error:", err && err.stack ? err.stack : err);
  process.exitCode = 1;
}
