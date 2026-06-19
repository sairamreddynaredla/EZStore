const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, "reports");
const BACKUP = path.join(REPORTS, "backups_deleted");
function ensure(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}
ensure(REPORTS);
ensure(BACKUP);

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}
function absp(p) {
  if (path.isAbsolute(p)) return p;
  return path.join(ROOT, p);
}

const verifyPath = path.join(REPORTS, "verify-images.json");
if (!fs.existsSync(verifyPath)) {
  console.error("verify-images.json not found");
  process.exit(1);
}
const j = JSON.parse(fs.readFileSync(verifyPath, "utf8"));

const toDeleteSet = new Set();

// Add safeToDelete entries
if (Array.isArray(j.safeToDelete)) {
  j.safeToDelete.forEach((p) => {
    const ap = absp(p);
    if (fs.existsSync(ap)) toDeleteSet.add(rel(ap));
  });
}

// Process duplicates: keep any .webp in workspace, delete jpg/jpeg/png that have a webp in same group
if (Array.isArray(j.duplicates)) {
  j.duplicates.forEach((group) => {
    // group are relative paths in verify json; map to absolute if exist
    const absExisting = group
      .map((p) => {
        const ap = absp(p);
        return fs.existsSync(ap) ? ap : null;
      })
      .filter(Boolean);
    if (absExisting.length <= 1) return;
    const webps = absExisting.filter((p) => /\.webp$/i.test(p)).map(rel);
    if (webps.length === 0) return; // no webp to prefer
    // mark non-webp existing files for deletion
    absExisting.forEach((p) => {
      if (!/\.webp$/i.test(p)) toDeleteSet.add(rel(p));
    });
  });
}

// finalize list
const toDelete = Array.from(toDeleteSet).sort();

const deleted = [];
let freed = 0;

toDelete.forEach((rp) => {
  const ap = absp(rp);
  if (!fs.existsSync(ap)) return;
  try {
    const stat = fs.statSync(ap);
    const backupPath = path.join(BACKUP, rp);
    ensure(path.dirname(backupPath));
    fs.copyFileSync(ap, backupPath);
    fs.unlinkSync(ap);
    deleted.push({ path: rp, bytes: stat.size });
    freed += stat.size;
  } catch (e) {
    console.error("failed to delete", rp, e.message);
  }
});

fs.writeFileSync(
  path.join(REPORTS, "deleted-files.txt"),
  deleted.map((d) => `${d.path} ${d.bytes}`).join("\n")
);
fs.writeFileSync(
  path.join(REPORTS, "deletion-log.json"),
  JSON.stringify({ deleted, totalFiles: deleted.length, freed }, null, 2)
);

console.log("Deleted", deleted.length, "files, freed bytes", freed);
process.exit(0);
