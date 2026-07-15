const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(ROOT, "reports");
const IMAGE_EXTS = [".png", ".jpg", ".jpeg"];
const CODE_EXTS = [".js", ".jsx", ".ts", ".tsx", ".json", ".html", ".css", ".md"];

async function ensureReportsDir() {
  try {
    await fs.mkdir(REPORTS_DIR, { recursive: true });
  } catch (e) {}
}

async function walk(dir, fileCallback) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (["node_modules", ".git", "dist", "build"].includes(ent.name)) continue;
      await walk(full, fileCallback);
    } else {
      await fileCallback(full);
    }
  }
}

async function collectImages() {
  const images = [];
  await walk(ROOT, async (file) => {
    const ext = path.extname(file).toLowerCase();
    if (IMAGE_EXTS.includes(ext)) {
      images.push(file);
    }
  });
  return images;
}

async function collectCodeFiles() {
  const files = [];
  await walk(ROOT, async (file) => {
    const rel = path.relative(ROOT, file);
    if (rel.startsWith("reports") || rel.startsWith("node_modules")) return;
    const ext = path.extname(file).toLowerCase();
    if (CODE_EXTS.includes(ext)) files.push(file);
  });
  return files;
}

async function fileHash(filePath) {
  const b = await fs.readFile(filePath);
  return crypto.createHash("md5").update(b).digest("hex");
}

async function statSafe(file) {
  try {
    return await fs.stat(file);
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log("Starting predeploy optimize...");
  await ensureReportsDir();
  const images = await collectImages();
  console.log("Images found:", images.length);

  const conversionResults = [];

  for (const img of images) {
    try {
      const origStat = await statSafe(img);
      const origSize = origStat ? origStat.size : 0;
      const hash = await fileHash(img);
      const dir = path.dirname(img);
      const base = path.basename(img, path.extname(img));
      const webpPath = path.join(dir, base + ".webp");

      let converted = false;
      const webpExists = await statSafe(webpPath);
      if (!webpExists) {
        // convert
        const buffer = await fs.readFile(img);
        const image = sharp(buffer);
        const meta = await image.metadata();
        const width = meta.width || null;
        const transform = width && width > 2000 ? image.resize(2000) : image;
        await transform.webp({ quality: 80 }).toFile(webpPath);
        converted = true;
      }

      const newStat = await statSafe(webpPath);
      const newSize = newStat ? newStat.size : 0;
      conversionResults.push({
        original: img,
        webp: webpPath,
        converted,
        hash,
        originalSize: origSize,
        newSize,
      });
    } catch (err) {
      console.error("Error processing", img, err.message);
    }
  }

  // collect code files and find references
  const codeFiles = await collectCodeFiles();
  const referenced = new Set();
  const codeContents = {};
  for (const cf of codeFiles) {
    try {
      codeContents[cf] = await fs.readFile(cf, "utf8");
    } catch (e) {
      codeContents[cf] = "";
    }
  }

  for (const res of conversionResults) {
    const rel = path.relative(ROOT, res.original).replace(/\\/g, "/");
    const name = path.basename(res.original);
    const nameNoExt = path.basename(res.original, path.extname(res.original));
    const webpName = nameNoExt + ".webp";
    for (const [cf, content] of Object.entries(codeContents)) {
      if (content.includes(rel) || content.includes(name) || content.includes(webpName)) {
        referenced.add(res.original);
        break;
      }
    }
  }

  const unused = conversionResults
    .filter((r) => !referenced.has(r.original))
    .map((r) => r.original);

  // duplicates
  const byHash = {};
  for (const r of conversionResults) {
    byHash[r.hash] = byHash[r.hash] || [];
    byHash[r.hash].push(r.original);
  }
  const duplicates = Object.values(byHash).filter((arr) => arr.length > 1);

  // update imports: replace occurrences of .png/.jpg/.jpeg with .webp when webp exists
  const backupsDir = path.join(REPORTS_DIR, "backups");
  await fs.mkdir(backupsDir, { recursive: true });
  const updatedFiles = [];

  for (const [cf, content] of Object.entries(codeContents)) {
    let newContent = content;
    for (const r of conversionResults) {
      const name = path.basename(r.original);
      const nameNoExt = path.basename(r.original, path.extname(r.original));
      const regex = new RegExp(nameNoExt + "\\.(png|jpg|jpeg)", "gi");
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, nameNoExt + ".webp");
      }
      // also replace exact relative paths
      const rel = path.relative(path.dirname(cf), r.original).replace(/\\/g, "/");
      if (newContent.includes(rel)) {
        const relWebp = rel.replace(/\.(png|jpg|jpeg)$/i, ".webp");
        newContent = newContent.split(rel).join(relWebp);
      }
    }
    if (newContent !== content) {
      const backupPath =
        path.join(backupsDir, path.relative(ROOT, cf).replace(/[\\/]/g, "__")) + ".bak";
      await fs.writeFile(backupPath, content, "utf8");
      await fs.writeFile(cf, newContent, "utf8");
      updatedFiles.push(cf);
    }
  }

  // write reports
  const convReport = {
    timestamp: new Date().toISOString(),
    totalImages: conversionResults.length,
    results: conversionResults,
  };
  await fs.writeFile(
    path.join(REPORTS_DIR, "image-conversion-report.json"),
    JSON.stringify(convReport, null, 2),
    "utf8"
  );

  // human readable md
  let md = "# Image Conversion Report\n\n";
  let totalOrig = 0,
    totalNew = 0;
  for (const r of conversionResults) {
    totalOrig += r.originalSize || 0;
    totalNew += r.newSize || 0;
    md += `- ${path.relative(ROOT, r.original)} -> ${path.relative(ROOT, r.webp)} | original: ${r.originalSize} bytes | new: ${r.newSize} bytes | saved: ${(r.originalSize || 0) - (r.newSize || 0)} bytes\n`;
  }
  md += `\n**Total original size:** ${totalOrig} bytes\n**Total new size:** ${totalNew} bytes\n**Total saved:** ${totalOrig - totalNew} bytes\n`;
  await fs.writeFile(path.join(REPORTS_DIR, "image-conversion-report.md"), md, "utf8");

  // unused images report
  let umd = "# Unused Images Report\n\n";
  umd += `Total images scanned: ${conversionResults.length}\n\n`;
  for (const u of unused) {
    umd += `- ${path.relative(ROOT, u)}\n`;
  }
  await fs.writeFile(path.join(REPORTS_DIR, "unused-images-report.md"), umd, "utf8");

  // duplicate images report
  let dmd = "# Duplicate Images Report\n\n";
  for (const group of duplicates) {
    dmd += "## Duplicate group\n";
    for (const f of group) {
      dmd += `- ${path.relative(ROOT, f)}\n`;
    }
    dmd += "\n";
  }
  await fs.writeFile(path.join(REPORTS_DIR, "duplicate-images-report.md"), dmd, "utf8");

  // updated imports preview
  await fs.writeFile(
    path.join(REPORTS_DIR, "updated-files.json"),
    JSON.stringify({ updatedFiles }, null, 2),
    "utf8"
  );

  // PRE_DEPLOYMENT_REPORT.md top-level summary
  const pre = `# PRE_DEPLOYMENT_REPORT\n\n- Total images scanned: ${conversionResults.length}\n- Unused images: ${unused.length}\n- Duplicate images groups: ${duplicates.length}\n- Files updated: ${updatedFiles.length}\n- Total space saved (bytes): ${conversionResults.reduce((s, r) => s + ((r.originalSize || 0) - (r.newSize || 0)), 0)}\n`;
  await fs.writeFile(path.join(REPORTS_DIR, "PRE_DEPLOYMENT_REPORT.md"), pre, "utf8");

  console.log("Done. Reports written to", REPORTS_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
