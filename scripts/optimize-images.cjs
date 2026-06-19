#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const ROOT = process.cwd();
const IMAGE_DIRS = [path.join(ROOT, 'src', 'assets'), path.join(ROOT, 'public')];
const FILE_TYPES_TO_UPDATE = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const MAX_WIDTH = 1600;
const QUALITY = 80;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function walk(dir, exts) {
  let results = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const dirent of list) {
      const res = path.join(dir, dirent.name);
      // skip common heavy/irrelevant folders
      if (dirent.isDirectory()) {
        if (['node_modules', '.git', 'dist', 'build', 'backups', 'backups_deleted', 'backups_duplicates'].includes(dirent.name)) continue;
        results = results.concat(await walk(res, exts));
      } else if (dirent.isFile()) {
        const ext = path.extname(dirent.name).toLowerCase();
        if (exts.includes(ext)) results.push(res);
      }
    }
  } catch (err) {
    // ignore missing directories
  }
  return results;
}

async function statSafe(file) {
  try { const s = await fs.stat(file); return s.size; } catch (e) { return 0; }
}

async function processImages() {
  const imageExts = ['.jpg', '.jpeg', '.png'];
  const images = [];
  for (const dir of IMAGE_DIRS) {
    const found = await walk(dir, imageExts);
    images.push(...found);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  const processedFiles = [];

  for (const imgPath of images) {
    try {
      const before = await statSafe(imgPath);
      totalBefore += before;

      const parsed = path.parse(imgPath);
      const outPath = path.join(parsed.dir, parsed.name + '.webp');

      // Read and process with sharp
      const image = sharp(imgPath);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }
      await pipeline.webp({ quality: QUALITY }).toFile(outPath);

      const after = await statSafe(outPath);
      totalAfter += after;

      // Delete original file
      await fs.unlink(imgPath);

      processed++;
      processedFiles.push({
        original: imgPath,
        output: outPath,
        before,
        after,
      });
      console.log(`Optimized: ${path.relative(ROOT, imgPath)} -> ${path.relative(ROOT, outPath)}`);
    } catch (err) {
      console.error('Failed processing', imgPath, err.message);
    }
  }

  return { processed, totalBefore, totalAfter, files: processedFiles };
}

async function updateReferences(processedFiles) {
  // Collect project files to update
  const targets = await walk(ROOT, FILE_TYPES_TO_UPDATE);

  for (const file of targets) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let updated = false;

      for (const f of processedFiles) {
        const relFromRoot = path.relative(ROOT, f.original).split(path.sep).join('/');
        const relFromSrc = relFromRoot.startsWith('src/') ? relFromRoot.slice(4) : relFromRoot;
        const basename = path.basename(f.original);
        const basenameNoExt = path.parse(basename).name;

        const patterns = [relFromRoot, relFromSrc, `/${relFromSrc}`, `./${relFromSrc}`, basename];

        for (const p of patterns) {
          const pEsc = escapeRegExp(p.replace(/\.(jpg|jpeg|png)$/i, ''));
          const re = new RegExp(pEsc + '\\.(jpg|jpeg|png)(\\?[^"'"'\\s\)<>]*)?', 'gi');
          const replacement = (m, ext, query) => `${p.replace(/\.(jpg|jpeg|png)$/i, '')}.webp${query || ''}`;
          const newContent = content.replace(re, replacement);
          if (newContent !== content) {
            content = newContent;
            updated = true;
          }
        }
      }

      if (updated) {
        await fs.writeFile(file, content, 'utf8');
        console.log(`Updated references in ${path.relative(ROOT, file)}`);
      }
    } catch (err) {
      // skip binary or unreadable files
    }
  }
}

function humanBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

async function main() {
  console.log('Scanning and optimizing images...');
  const result = await processImages();

  if (result.processed === 0) {
    console.log('No images found to process.');
    return;
  }

  // Update references
  await updateReferences(result.files);

  const { processed, totalBefore, totalAfter } = result;
  const reduction = totalBefore > 0 ? ((totalBefore - totalAfter) / totalBefore) * 100 : 0;

  console.log('\nOptimization Summary:');
  console.log(`- Total images processed: ${processed}`);
  console.log(`- Total size before: ${humanBytes(totalBefore)}`);
  console.log(`- Total size after: ${humanBytes(totalAfter)}`);
  console.log(`- Reduction: ${reduction.toFixed(2)}%`);
}

main().catch((err) => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
