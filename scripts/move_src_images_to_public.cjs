const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src', 'assets', 'products');
const destDir = path.resolve(__dirname, '..', 'public', 'assets', 'products');

if (!fs.existsSync(srcDir)) {
  console.error('Source directory does not exist:', srcDir);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
let copied = 0;
files.forEach((file) => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  const stat = fs.statSync(srcPath);
  if (stat.isFile()) {
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
      copied++;
      console.log('Copied', file);
    } else {
      // Skip existing file
    }
  }
});

console.log(`Done. Copied ${copied} files from ${srcDir} to ${destDir}`);
