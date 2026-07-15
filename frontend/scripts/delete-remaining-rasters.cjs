const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
function walk(dir) {
  return fs.readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const rasters = walk(cwd).filter(
  (f) =>
    /\.(png|jpe?g)$/i.test(f) &&
    !f.includes(path.sep + "node_modules" + path.sep) &&
    !f.includes(path.sep + "dist" + path.sep) &&
    !f.includes(path.sep + "reports" + path.sep)
);
if (rasters.length === 0) {
  console.log("No raster files found.");
  process.exit(0);
}
const backupRoot = path.join(cwd, "reports", "backups_deleted");
fs.mkdirSync(backupRoot, { recursive: true });
const deleted = [];
let total = 0;
for (const f of rasters) {
  const rel = path.relative(cwd, f);
  const dest = path.join(backupRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    fs.copyFileSync(f, dest);
    const size = fs.statSync(f).size;
    fs.unlinkSync(f);
    deleted.push({ path: rel, size });
    total += size;
    console.log("deleted", rel, size);
  } catch (err) {
    console.error("error processing", rel, err.message);
  }
}
fs.writeFileSync(path.join("reports", "deleted-files.txt"), deleted.map((x) => x.path).join("\n"));
fs.writeFileSync(
  path.join("reports", "deletion-log.json"),
  JSON.stringify({ deleted, total }, null, 2)
);
fs.writeFileSync(
  path.join("reports", "safe-to-delete.txt"),
  fs.existsSync("reports/safe-to-delete.txt")
    ? fs.readFileSync("reports/safe-to-delete.txt") +
        "\n\n-- Deleted by script --\n" +
        deleted.map((d) => d.path).join("\n")
    : deleted.map((d) => d.path).join("\n")
);
console.log(`Deleted ${deleted.length} files, freed ${total} bytes`);
// update remaining-raster-images.md
const remFile = path.join("reports", "remaining-raster-images.md");
let remText = `# Remaining Raster Images (JPG/JPEG/PNG)\n\nDeleted ${deleted.length} files in this pass.\n\nSee reports/deleted-files.txt and reports/deletion-log.json for details.\n`;
fs.writeFileSync(remFile, remText);
// run build
console.log("Running production build...");
const { spawnSync } = require("child_process");
const build = spawnSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "build", "--silent"],
  { stdio: "inherit" }
);
if (build.status !== 0) {
  console.error("Build failed with code", build.status);
  process.exit(build.status || 1);
}
// compute dist size
function walk2(d) {
  return fs.readdirSync(d).flatMap((f) => {
    const p = path.join(d, f);
    return fs.statSync(p).isDirectory() ? walk2(p) : [p];
  });
}
if (fs.existsSync("dist")) {
  const files = walk2("dist");
  const tot = files.reduce((s, f) => s + fs.statSync(f).size, 0);
  fs.writeFileSync(path.join("reports", "final-dist-size.txt"), String(tot));
  console.log("Final dist total bytes:", tot);
}
console.log("Done.");
