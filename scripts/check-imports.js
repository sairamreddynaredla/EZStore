const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

const exts = [".js", ".jsx", ".ts", ".tsx", ".json", ".css"];

function resolveImport(fromFile, spec) {
  if (!spec.startsWith(".") && !spec.startsWith("/")) return true; // skip non-relative

  const base = path.resolve(path.dirname(fromFile), spec);

  // Direct file
  for (const e of exts) {
    if (fs.existsSync(base + e)) return true;
  }

  // Index files in folder
  for (const e of exts) {
    if (fs.existsSync(path.join(base, "index" + e))) return true;
  }

  // Direct folder with package.json (rare)
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return true;

  return false;
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      scanDir(p);
    } else if (/\.(js|jsx|ts|tsx)$/.test(f)) {
      const content = fs.readFileSync(p, "utf8");
      const re = /import\s+(?:[^'"\n]+from\s+)?['"]([^'"]+)['"];?/g;
      let m;
      while ((m = re.exec(content))) {
        const spec = m[1];
        if (spec.startsWith(".") || spec.startsWith("/")) {
          const ok = resolveImport(p, spec);
          if (!ok) {
            console.log(`MISSING -> ${path.relative(ROOT, p)} imports ${spec}`);
          }
        }
      }
    }
  }
}

console.log("Scanning src imports...");
scanDir(SRC);
console.log("Done.");
