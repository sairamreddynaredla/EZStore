const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, "reports");
const BACKUP_DIR = path.join(REPORTS_DIR, "backups");

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

ensureDir(REPORTS_DIR);
ensureDir(BACKUP_DIR);

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      // skip node_modules and reports and .git
      const rel = path.relative(ROOT, fp).split(path.sep)[0];
      if (rel === "node_modules" || rel === "reports" || rel === ".git") return;
      walk(fp, filelist);
    } else {
      filelist.push(fp);
    }
  });
  return filelist;
}

function sha1File(fp) {
  const data = fs.readFileSync(fp);
  return crypto.createHash("sha1").update(data).digest("hex");
}

function isImageExt(name) {
  return /\.(png|jpe?g|webp)$/i.test(name);
}

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

const allFiles = walk(ROOT);
const codeFiles = allFiles.filter((f) => /\.(js|jsx|ts|tsx|json|css|html|md)$/i.test(f));
const imageFiles = allFiles.filter(
  (f) => isImageExt(f) && /(^src\/|^public\/|assets\/|images\/)/i.test(rel(f))
);

const byDirAndName = {}; // key: dir + basename (no ext) -> {webp, originals: []}
imageFiles.forEach((img) => {
  const dir = path.dirname(img);
  const base = path.parse(img).name;
  const ext = path.parse(img).ext.toLowerCase();
  const key = path.join(dir, base);
  if (!byDirAndName[key]) byDirAndName[key] = { webp: null, originals: [] };
  if (ext === ".webp") byDirAndName[key].webp = img;
  else byDirAndName[key].originals.push(img);
});

const unused = [];
const changedFiles = [];
const safeToDelete = [];
const dupeMap = {}; // hash -> [files]

// build dupe map
imageFiles.forEach((img) => {
  try {
    const h = sha1File(img);
    if (!dupeMap[h]) dupeMap[h] = [];
    dupeMap[h].push(img);
  } catch (e) {
    // ignore read errors
  }
});

const duplicates = Object.values(dupeMap).filter((arr) => arr.length > 1);

function fileHasReferenceTo(filePath, imageName) {
  try {
    const cont = fs.readFileSync(filePath, "utf8");
    // look for "imageName" or url(imageName) or import statements
    const qRegex = new RegExp(
      "[\"']" + imageName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "[\"']",
      "i"
    );
    const urlRegex = new RegExp(
      "url\\((\\s*[^)\\)]*" + imageName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "[^)\\)]*\\))",
      "i"
    );
    const importRegex = new RegExp(
      "from\\s+[\"']([^\"']*" + imageName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + ")[\"']",
      "i"
    );
    const simpleRegex = new RegExp(imageName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
    return (
      qRegex.test(cont) || urlRegex.test(cont) || importRegex.test(cont) || simpleRegex.test(cont)
    );
  } catch (e) {
    return false;
  }
}

let totalOriginalBytes = 0;
let totalWebpBytes = 0;

for (const key of Object.keys(byDirAndName)) {
  const entry = byDirAndName[key];
  if (!entry.originals.length) continue;
  const webp = entry.webp;
  entry.originals.forEach((orig) => {
    const origName = path.basename(orig);
    let isReferenced = false;
    const refFiles = [];
    for (const cf of codeFiles) {
      if (fileHasReferenceTo(cf, origName)) {
        isReferenced = true;
        refFiles.push(cf);
      }
    }
    if (!isReferenced) {
      unused.push(orig);
    }
    if (webp) {
      try {
        const oStat = fs.statSync(orig);
        const wStat = fs.statSync(webp);
        totalOriginalBytes += oStat.size;
        totalWebpBytes += wStat.size;
      } catch (e) {}

      // check if webp is referenced anywhere
      const webpName = path.basename(webp);
      let webpReferenced = false;
      for (const cf of codeFiles) {
        if (fileHasReferenceTo(cf, webpName)) {
          webpReferenced = true;
          break;
        }
      }

      if (webpReferenced && !isReferenced) {
        // webp used and original not used -> safe
        safeToDelete.push(orig);
      } else if (webpReferenced && isReferenced) {
        // update references of original to webp
        refFiles.forEach((rf) => {
          try {
            let cont = fs.readFileSync(rf, "utf8");
            const patterns = [
              new RegExp(
                "([\"'])" + origName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "([\"'])",
                "g"
              ),
              new RegExp(
                "url\\((\\s*[\"']?)" +
                  origName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") +
                  "([\"']?\\s*)\\)",
                "g"
              ),
            ];
            let replaced = false;
            patterns.forEach((pat) => {
              if (pat.test(cont)) {
                cont = cont.replace(pat, (m, g1, g2) => {
                  if (m.startsWith("url(")) {
                    return "url(" + (g1 || "") + webpName + (g2 || "") + ")";
                  }
                  return (g1 || '"') + webpName + (g2 || '"');
                });
                replaced = true;
              }
            });
            if (replaced) {
              const relPath = rel(rf).replace(/[\/\\]/g, "_");
              const bakPath = path.join(BACKUP_DIR, relPath + ".bak");
              if (!fs.existsSync(bakPath)) fs.writeFileSync(bakPath, fs.readFileSync(rf, "utf8"));
              fs.writeFileSync(rf, cont, "utf8");
              changedFiles.push(rf);
            }
          } catch (e) {}
        });
        // re-check references
        let stillReferenced = false;
        for (const cf of codeFiles) {
          if (fileHasReferenceTo(cf, origName)) {
            stillReferenced = true;
            break;
          }
        }
        if (!stillReferenced) safeToDelete.push(orig);
      } else if (!webpReferenced && isReferenced) {
        // update imports to webp
        const webpName = path.basename(webp);
        refFiles.forEach((rf) => {
          try {
            let cont = fs.readFileSync(rf, "utf8");
            const patterns = [
              new RegExp(
                "([\"'])" + origName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "([\"'])",
                "g"
              ),
              new RegExp(
                "url\\((\\s*[\"']?)" +
                  origName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") +
                  "([\"']?\\s*)\\)",
                "g"
              ),
            ];
            let replaced = false;
            patterns.forEach((pat) => {
              if (pat.test(cont)) {
                cont = cont.replace(pat, (m, g1, g2) => {
                  if (m.startsWith("url(")) {
                    return "url(" + (g1 || "") + webpName + (g2 || "") + ")";
                  }
                  return (g1 || '"') + webpName + (g2 || '"');
                });
                replaced = true;
              }
            });
            if (replaced) {
              const relPath = rel(rf).replace(/[\/\\]/g, "_");
              const bakPath = path.join(BACKUP_DIR, relPath + ".bak");
              if (!fs.existsSync(bakPath)) fs.writeFileSync(bakPath, fs.readFileSync(rf, "utf8"));
              fs.writeFileSync(rf, cont, "utf8");
              changedFiles.push(rf);
            }
          } catch (e) {}
        });
        let stillReferenced = false;
        for (const cf of codeFiles) {
          if (fileHasReferenceTo(cf, origName)) {
            stillReferenced = true;
            break;
          }
        }
        if (!stillReferenced) safeToDelete.push(orig);
      }
    }
  });
}

const totalImages = imageFiles.length;
const jpgCount = imageFiles.filter((f) => /\.jpg$/i.test(f)).length;
const jpegCount = imageFiles.filter((f) => /\.jpeg$/i.test(f)).length;
const pngCount = imageFiles.filter((f) => /\.png$/i.test(f)).length;
const webpCount = imageFiles.filter((f) => /\.webp$/i.test(f)).length;

const duplicateList = duplicates.map((group) => group.map(rel));
let spaceSaved = Math.max(0, totalOriginalBytes - totalWebpBytes);

const irLines = [];
irLines.push("# Image Report");
irLines.push("");
irLines.push(`- Total images: ${totalImages}`);
irLines.push(`- JPG count: ${jpgCount}`);
irLines.push(`- JPEG count: ${jpegCount}`);
irLines.push(`- PNG count: ${pngCount}`);
irLines.push(`- WEBP count: ${webpCount}`);
irLines.push("");
irLines.push("## Duplicates");
if (duplicateList.length) {
  duplicateList.forEach((g, i) => {
    irLines.push(`- Group ${i + 1}:`);
    g.forEach((p) => irLines.push(`  - ${p}`));
  });
} else irLines.push("- None");
irLines.push("");
irLines.push(`- Space saved if originals replaced by webp: ${spaceSaved} bytes`);

fs.writeFileSync(path.join(REPORTS_DIR, "image-report.md"), irLines.join("\n"));
fs.writeFileSync(
  path.join(REPORTS_DIR, "verify-images.json"),
  JSON.stringify(
    {
      totalImages,
      jpgCount,
      jpegCount,
      pngCount,
      webpCount,
      duplicates: duplicateList,
      changedFiles: changedFiles.map(rel),
      safeToDelete: safeToDelete.map(rel),
      unused: unused.map(rel),
      spaceSaved,
    },
    null,
    2
  )
);

const uLines = [];
uLines.push("# Unused Images");
if (unused.length) {
  unused.forEach((u) => uLines.push(`- ${rel(u)}`));
} else uLines.push("- None");
fs.writeFileSync(path.join(REPORTS_DIR, "unused-images.md"), uLines.join("\n"));

fs.writeFileSync(path.join(REPORTS_DIR, "safe-to-delete.txt"), safeToDelete.map(rel).join("\n"));

console.log("Verify script finished. Reports written to reports/");
console.log("Summary:", {
  totalImages,
  jpgCount,
  jpegCount,
  pngCount,
  webpCount,
  changedFiles: changedFiles.length,
  safeToDelete: safeToDelete.length,
  unused: unused.length,
});

process.exit(0);
