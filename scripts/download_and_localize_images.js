const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const productsFile = path.resolve(__dirname, '../src/data/products.js');
const assetsDir = path.resolve(__dirname, '../src/assets/products');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const text = fs.readFileSync(productsFile, 'utf8');

// Find all http(s) image URLs (jpg/png/webp/svg)
const urlGlobalRegex = /(https?:\/\/[\w\-./@:%?=+&;#~()]+?\.(?:png|jpg|jpeg|webp|svg))/gi;
let matches;
const toDownload = [];
while ((matches = urlGlobalRegex.exec(text)) !== null) {
  toDownload.push({ url: matches[1], index: matches.index });
}

// Deduplicate by url
const unique = [];
const seen = new Set();
for (const item of toDownload) {
  if (!seen.has(item.url)) {
    seen.add(item.url);
    unique.push(item);
  }
}

if (unique.length === 0) {
  console.log('No remote images found to download.');
  process.exit(0);
}

console.log('Found', unique.length, 'unique image URLs to download.');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow redirect
        return resolve(download(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed to download ' + url + ' - status ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
      file.on('error', (err) => reject(err));
    });
    req.on('error', reject);
  });
}

(async () => {
  const replacements = {}; // url -> localPath
  for (let i = 0; i < unique.length; i++) {
    const { url } = unique[i];
    try {
      const urlObj = new URL(url);
      let base = path.basename(urlObj.pathname);
      if (!base || base.length > 80) base = 'img' + i + path.extname(urlObj.pathname || '.jpg');
      // sanitize
      base = base.replace(/[^a-zA-Z0-9._-]/g, '_');
      let filename = base;
      let counter = 1;
      while (fs.existsSync(path.join(assetsDir, filename))) {
        filename = base.replace(/(\.[^.]+)$/, '_' + counter + '$1');
        counter++;
      }
      const destPath = path.join(assetsDir, filename);
      console.log('Downloading', url, '->', destPath);
      await download(url, destPath);
      const rel = '/assets/products/' + filename;
      replacements[url] = rel;
    } catch (err) {
      console.error('Error downloading', unique[i].url, err.message);
    }
  }

  // create a backup
  fs.copyFileSync(productsFile, productsFile + '.bak');
  let newText = text;
  // Replace all occurrences of the original URLs with local paths
  for (const [orig, local] of Object.entries(replacements)) {
    // escape for regex
    const esc = orig.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    newText = newText.replace(new RegExp(esc, 'g'), local);
  }

  fs.writeFileSync(productsFile, newText, 'utf8');
  console.log('Rewrote', productsFile, 'and saved backup at', productsFile + '.bak');
})();
