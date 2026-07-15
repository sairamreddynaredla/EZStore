const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dataDir = path.join(root, "src", "data");

function formatLb(n) {
  if (Number.isInteger(n)) return `${n}lb`;
  const rounded = Math.round(n * 10) / 10; // 1 decimal
  if (Number.isInteger(rounded)) return `${rounded}lb`;
  return `${rounded}lb`;
}

function convertKg(match, p1) {
  const num = parseFloat(p1);
  const lb = num * 2; // using their mapping: 1kg => 2lb
  return formatLb(lb);
}

function convertRangeKg(match, p1, p2) {
  const a = parseFloat(p1) * 2;
  const b = parseFloat(p2) * 2;
  const fmtA = Number.isInteger(a) ? `${a}` : Math.round(a * 10) / 10;
  const fmtB = Number.isInteger(b) ? `${b}` : Math.round(b * 10) / 10;
  return `${fmtA}-${fmtB}lb`;
}

function convertG(match, p1) {
  const num = parseFloat(p1);
  const lb = num * 0.002; // 1g => 0.002 lb using 1kg=2lb mapping
  return formatLb(lb);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content;

  // Ranges like 25-34kg or 3–6 kg (dash or en-dash)
  updated = updated.replace(/(\d+(?:\.\d+)?)\s*[\-–]\s*(\d+(?:\.\d+)?)\s*kg/gi, convertRangeKg);

  // kg values (decimal or integer)
  updated = updated.replace(/(\d+(?:\.\d+)?)\s*kg/gi, convertKg);

  // grams (e.g., 907g, 85g, 14g)
  updated = updated.replace(/(\d+)\s*g\b/gi, convertG);

  // plural words (standalone) - replace 'kilograms' or 'kilogram' or 'grams' with 'lb' (best-effort)
  updated = updated.replace(/\bkilograms?\b/gi, "lb");
  updated = updated.replace(/\bgrams?\b/gi, "lb");

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("Updated", filePath);
    return true;
  }
  return false;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && /\.jsx?$/.test(e.name)) processFile(full);
  }
}

if (!fs.existsSync(dataDir)) {
  console.error("Data directory not found:", dataDir);
  process.exit(1);
}

walk(dataDir);
console.log("Conversion complete.");
