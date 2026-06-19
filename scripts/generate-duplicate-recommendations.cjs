const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const SUM = path.join(ROOT, "reports", "image-optimization-summary.json");
if (!fs.existsSync(SUM)) {
  console.error("summary missing");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(SUM, "utf8"));
const dups = data.duplicates || [];
const keepList = [];
const deleteList = [];
function preferKeep(group) {
  // prefer src/assets/products > src/assets > src > public > dist > others
  const score = (p) => {
    if (
      p.startsWith("src" + path.sep + "assets" + path.sep + "products") ||
      p.includes(path.join("src", "products"))
    )
      return 100;
    if (p.startsWith("src" + path.sep + "assets")) return 90;
    if (p.startsWith("src" + path.sep)) return 80;
    if (p.startsWith("public" + path.sep)) return 70;
    if (p.startsWith("dist" + path.sep)) return 50;
    return 10;
  };
  let best = group[0];
  for (const g of group) {
    if (score(g) > score(best)) best = g;
  }
  return best;
}
for (const group of dups) {
  // ensure paths are normalized to platform
  const norm = group.map((p) => p.replace(/\//g, path.sep));
  const keep = preferKeep(norm);
  keepList.push(keep);
  for (const p of norm) {
    if (p !== keep) deleteList.push(p);
  }
}
fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "reports", "duplicate-keep.txt"), keepList.join("\n"));
fs.writeFileSync(path.join(ROOT, "reports", "duplicate-safe-to-delete.txt"), deleteList.join("\n"));
console.log(
  "Wrote duplicate recommendations:",
  keepList.length,
  "keep,",
  deleteList.length,
  "delete"
);
