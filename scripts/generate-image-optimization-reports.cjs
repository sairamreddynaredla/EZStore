const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, "reports");
if (!fs.existsSync(REPORTS)) fs.mkdirSync(REPORTS, { recursive: true });

function walk(dir, list = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const rel = path.relative(ROOT, p).split(path.sep)[0];
      if (["node_modules", ".git", "reports"].includes(rel)) continue;
      walk(p, list);
    } else list.push(p);
  }
  return list;
}

function isRaster(name) {
  return /\.(png|jpe?g)$/i.test(name);
}
function isImage(name) {
  return /\.(png|jpe?g|webp)$/i.test(name);
}
function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

(async function main() {
  const all = walk(ROOT);
  const codeFiles = all.filter((f) => /\.(js|jsx|ts|tsx|css|html|json|md)$/i.test(f));
  const imageFiles = all.filter(
    (f) => isImage(f) && /^src[\\/]|^public[\\/]|[\\/]assets[\\/]/i.test(rel(f))
  );

  const images = imageFiles.map((p) => ({
    path: p,
    rel: rel(p),
    name: path.basename(p),
    dir: path.dirname(p),
    ext: path.extname(p).toLowerCase(),
  }));

  // map basenames to webp
  const byKey = {}; // dir+base -> {webp, originals:[]}
  for (const img of images) {
    const base = path.parse(img.path).name;
    const key = path.join(img.dir, base);
    if (!byKey[key]) byKey[key] = { webp: null, originals: [] };
    if (img.ext === ".webp") byKey[key].webp = img.path;
    else byKey[key].originals.push(img.path);
  }

  // build hash map and metadata
  const hashMap = {}; // sha1 -> [paths]
  const meta = {};
  for (const img of images) {
    try {
      const buf = fs.readFileSync(img.path);
      const hash = crypto.createHash("sha1").update(buf).digest("hex");
      if (!hashMap[hash]) hashMap[hash] = [];
      hashMap[hash].push(img.path);
      // dimensions via sharp
      let info = { size: buf.length };
      try {
        const s = await sharp(img.path).metadata();
        info.width = s.width;
        info.height = s.height;
        info.format = s.format;
      } catch (e) {
        /* ignore */
      }
      meta[img.path] = info;
    } catch (e) {
      console.error("read error", img.path, e.message);
    }
  }

  const duplicateGroups = Object.values(hashMap).filter((g) => g.length > 1);

  // find references for each non-webp image
  function fileContains(filePath, needle) {
    try {
      const c = fs.readFileSync(filePath, "utf8");
      return c.indexOf(needle) !== -1;
    } catch (e) {
      return false;
    }
  }

  const mixedMappings = [];
  const unused = [];
  const safeToDelete = [];
  const updatedRefs = []; // non-destructive: just record potential refs

  for (const key of Object.keys(byKey)) {
    const entry = byKey[key];
    if (!entry.originals.length) continue;
    const webp = entry.webp;
    for (const orig of entry.originals) {
      const name = path.basename(orig);
      const references = codeFiles.filter((cf) => fileContains(cf, name));
      const webpName = webp ? path.basename(webp) : null;
      const webpRefs = webp ? codeFiles.filter((cf) => fileContains(cf, webpName)) : [];

      if (references.length === 0 && (!webp || webpRefs.length === 0)) {
        unused.push(orig);
      }

      if (webp) {
        mixedMappings.push({
          original: orig,
          webp,
          referencedFiles: references.map(rel),
          webpReferencedFiles: webpRefs.map(rel),
        });
        if (webpRefs.length > 0 && references.length === 0) {
          safeToDelete.push(orig);
        }
      }
    }
  }

  // oversized detection by heuristics
  const recommendations = [];
  function recommendMaxWidth(p) {
    const r = rel(p);
    if (/banner|hero/i.test(r)) return 1600;
    if (/category|category-banner/i.test(r)) return 1200;
    if (/products|product/i.test(r)) return 800;
    if (/brand|brands|logo/i.test(r)) return 300;
    return 1200; // default
  }
  for (const img of images) {
    const info = meta[img.path] || {};
    const recommended = recommendMaxWidth(img.path);
    if (info.width && info.width > recommended) {
      recommendations.push({
        path: img.path,
        rel: rel(img.path),
        width: info.width,
        height: info.height,
        recommended,
      });
    }
  }

  const largeAssets = images
    .filter((i) => {
      const s = meta[i.path] && meta[i.path].size;
      return s && s > 500 * 1024;
    })
    .map((i) => ({ path: i.path, rel: rel(i.path), size: meta[i.path].size }));

  // lazy-load detection: find <img in JSX files and whether loading attr present
  const lazyFindings = [];
  const jsxFiles = all.filter(
    (f) => /\.(jsx|tsx|js|ts)$/i.test(f) && f.includes(path.join("src", ""))
  );
  for (const f of jsxFiles) {
    try {
      const c = fs.readFileSync(f, "utf8");
      const imgTags = c.match(/<img[\s\S]*?>/g);
      if (!imgTags) continue;
      imgTags.forEach((t) => {
        if (!/loading\s*=/.test(t)) lazyFindings.push({ file: rel(f), tag: t.replace(/\n/g, " ") });
      });
    } catch (e) {}
  }

  // prepare reports
  const now = new Date().toISOString();
  fs.writeFileSync(
    path.join(REPORTS, "image-scan.json"),
    JSON.stringify({ generated: now, totalImages: images.length }, null, 2)
  );

  // Mixed formats report
  const mm = ["# Mixed Image Formats Report", ""];
  mixedMappings.forEach((m) => {
    mm.push(`- Original: ${rel(m.original)}`);
    mm.push(`  - WebP: ${rel(m.webp)}`);
    mm.push(`  - References (${m.referencedFiles.length}):`);
    m.referencedFiles.forEach((r) => mm.push(`    - ${r}`));
    mm.push(`  - WebP referenced in (${m.webpReferencedFiles.length}):`);
    m.webpReferencedFiles.forEach((r) => mm.push(`    - ${r}`));
    mm.push("");
  });
  fs.writeFileSync(path.join(REPORTS, "mixed-formats-report.md"), mm.join("\n"));

  // duplicates
  const dupLines = ["# Duplicate Images Report", ""];
  if (duplicateGroups.length === 0) dupLines.push("- None");
  else {
    duplicateGroups.forEach((g, i) => {
      dupLines.push(`- Group ${i + 1}:`);
      g.forEach((p) => {
        const info = meta[p] || {};
        dupLines.push(
          `  - ${rel(p)} — ${info.width || "?"}x${info.height || "?"} — ${info.size || "?"} bytes`
        );
      });
      // recommend keep the smallest path under src/products or prefer one under src/assets
      const keep = g.find((p) => p.includes(path.join("src", "assets"))) || g[0];
      dupLines.push(`  - Recommended keep: ${rel(keep)}`);
      dupLines.push("");
    });
  }
  fs.writeFileSync(path.join(REPORTS, "duplicate-images-report.md"), dupLines.join("\n"));
  fs.writeFileSync(path.join(REPORTS, "safe-to-delete.txt"), safeToDelete.map(rel).join("\n"));

  // unused
  const unusedLines = ["# Unused Images", ""];
  if (unused.length === 0) unusedLines.push("- None");
  else unused.forEach((u) => unusedLines.push(`- ${rel(u)}`));
  fs.writeFileSync(path.join(REPORTS, "unused-images-report.md"), unusedLines.join("\n"));

  // oversized
  const osLines = ["# Oversized Images Recommendations", ""];
  if (recommendations.length === 0) osLines.push("- None");
  else
    recommendations.forEach((r) =>
      osLines.push(`- ${r.rel} — ${r.width}x${r.height}, recommended max width ${r.recommended}`)
    );
  fs.writeFileSync(path.join(REPORTS, "oversized-recommendations.md"), osLines.join("\n"));

  // large assets
  const laLines = ["# Large Assets (>500KB)", ""];
  if (largeAssets.length === 0) laLines.push("- None");
  else largeAssets.forEach((a) => laLines.push(`- ${a.rel} — ${a.size} bytes`));
  fs.writeFileSync(path.join(REPORTS, "large-assets-report.md"), laLines.join("\n"));

  // lazy load
  const llLines = ["# Lazy-load Findings", ""];
  if (lazyFindings.length === 0)
    llLines.push("- No <img> tags without loading attribute detected in scanned JSX files");
  else lazyFindings.slice(0, 200).forEach((l) => llLines.push(`- ${l.file}: ${l.tag}`));
  fs.writeFileSync(path.join(REPORTS, "lazy-load-report.md"), llLines.join("\n"));

  // summary
  const summary = {
    totalImages: images.length,
    jpg: images.filter((i) => /\.jpg$/i.test(i.path)).length,
    jpeg: images.filter((i) => /\.jpeg$/i.test(i.path)).length,
    png: images.filter((i) => /\.png$/i.test(i.path)).length,
    webp: images.filter((i) => /\.webp$/i.test(i.path)).length,
    duplicates: duplicateGroups.map((g) => g.map(rel)),
    mixedMappings: mixedMappings.map((m) => ({
      original: rel(m.original),
      webp: rel(m.webp),
      references: m.referencedFiles.map((r) => r),
      webpReferences: m.webpReferencedFiles,
    })),
    unused: unused.map(rel),
    safeToDelete: safeToDelete.map(rel),
    oversized: recommendations,
    largeAssets: largeAssets,
  };
  fs.writeFileSync(
    path.join(REPORTS, "image-optimization-summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log("Reports written to", REPORTS);

  // run build but capture output to build-report.md
  console.log("Running production build for report (non-destructive)...");
  const { spawnSync } = require("child_process");
  const build = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], {
    encoding: "utf8",
  });
  const br = [
    "# Build Report",
    "",
    "Command: npm run build",
    "",
    "Exit code: " + (build.status === null ? "null" : build.status),
    "",
    "Stdout:",
    "```",
    build.stdout || "",
    "```",
    "",
    "Stderr:",
    "```",
    build.stderr || "",
    "```",
  ];
  fs.writeFileSync(path.join(REPORTS, "build-report.md"), br.join("\n"));
  console.log("Build report written.");

  // final summary
  const final = [];
  final.push("# PRE_DEPLOYMENT_OPTIMIZATION_REPORT");
  final.push("");
  final.push(`- Total images scanned: ${summary.totalImages}`);
  final.push(`- WebP images: ${summary.webp}`);
  final.push(`- Duplicate groups: ${duplicateGroups.length}`);
  final.push(`- Unused images found: ${summary.unused.length}`);
  final.push(`- Safe to delete candidates (non-destructive): ${summary.safeToDelete.length}`);
  final.push("");
  fs.writeFileSync(path.join(REPORTS, "PRE_DEPLOYMENT_OPTIMIZATION_REPORT.md"), final.join("\n"));
})();
