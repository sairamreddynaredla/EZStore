const fs = require("fs");
const path = require("path");

const data = fs.readFileSync("./src/data/products.js", "utf8");

const urls = [
  ...data.matchAll(/https?:\/\/[^"' )]+/g)
].map(x => x[0]);

const files = [];

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else {
      files.push(path.basename(file));
    }
  }
}

walk("./src/assets");

const assets = new Set(files);

let found = 0;

for (const url of urls) {
  const fileName = path.basename(url.split("?")[0]);

  if (assets.has(fileName)) {
    found++;
  }
}

console.log("URLs:", urls.length);
console.log("Local Images:", assets.size);
console.log("Matched:", found);