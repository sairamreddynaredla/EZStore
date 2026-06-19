const fs = require("fs");
const path = require("path");
const child = require("child_process");
const ROOT = process.cwd();
const reportsDir = path.join(ROOT, "reports");
const sumFile = path.join(reportsDir, "image-optimization-summary.json");
if (!fs.existsSync(sumFile)) {
  console.error("Missing", sumFile);
  process.exit(1);
}
const summary = JSON.parse(fs.readFileSync(sumFile, "utf8"));
const groups = summary.duplicates || [];
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = path.join(reportsDir, "backups_duplicates", timestamp);
fs.mkdirSync(backupRoot, { recursive: true });
const deleted = [];
const mapping = {}; // deleted -> keep
function preferKeep(group) {
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
for (const group of groups) {
  const norm = group.map((p) => p.replace(/\//g, path.sep));
  const keep = preferKeep(norm);
  for (const p of norm) {
    if (p === keep) continue;
    const abs = path.join(ROOT, p);
    if (!fs.existsSync(abs)) continue;
    const rel = p;
    const backupPath = path.join(backupRoot, rel);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.copyFileSync(abs, backupPath);
    fs.unlinkSync(abs);
    deleted.push(rel);
    mapping[rel] = keep;
  }
}
fs.writeFileSync(path.join(reportsDir, "deleted-duplicates.txt"), deleted.join("\n"));
fs.writeFileSync(
  path.join(reportsDir, "deleted-duplicates-log.json"),
  JSON.stringify({ timestamp, deleted, mapping }, null, 2)
);
console.log("Deleted", deleted.length, "files; backups at", backupRoot);
// Attempt to rewrite imports: replace deleted basenames with keep basenames across common source files
const exts = [".js", ".jsx", ".ts", ".tsx", ".css", ".html", ".json", ".md"];
const walk = (dir) => {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === "reports" || name === "dist") continue;
      res.push(...walk(p));
    } else {
      if (exts.includes(path.extname(name))) res.push(p);
    }
  }
  return res;
};
const files = walk(ROOT);
let replaceCount = 0;
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  let changed = false;
  for (const deletedRel of Object.keys(mapping)) {
    const keepRel = mapping[deletedRel];
    const delBase = path.basename(deletedRel);
    const keepBase = path.basename(keepRel);
    if (s.includes(delBase) && delBase !== keepBase) {
      s = s.split(delBase).join(keepBase);
      changed = true;
      replaceCount++;
    }
  }
  if (changed) {
    fs.writeFileSync(f, s, "utf8");
  }
}
fs.writeFileSync(
  path.join(reportsDir, "import-rewrite-summary.txt"),
  `replacements: ${replaceCount}\n`
);
// Run build
try {
  console.log("Running npm run build...");
  child.execSync("npm run build", { stdio: "inherit", cwd: ROOT });
  fs.writeFileSync(
    path.join(reportsDir, "build-after-duplicates.txt"),
    "Build succeeded at " + new Date().toISOString()
  );
} catch (err) {
  fs.writeFileSync(
    path.join(reportsDir, "build-after-duplicates.txt"),
    "Build failed: " + err.message
  );
  console.error("Build failed, see reports/build-after-duplicates.txt");
  process.exit(1);
}
