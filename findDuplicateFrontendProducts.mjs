import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'frontend', 'src', 'data');
const productFiles = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, name.name);
    if (name.isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|jsx|mjs)$/.test(name.name)) {
      productFiles.push(fullPath);
    }
  }
}

walk(dataDir);

const duplicates = { ids: new Map(), names: new Map(), slugs: new Map() };
const productPattern = /\{([\s\S]*?\})/g;
const namePattern = /name\s*:\s*['\"]([^'\"]+)['\"]/;
const idPattern = /id\s*:\s*(\d+)/;
const slugPattern = /slug\s*:\s*['\"]([^'\"]+)['\"]/;

for (const file of productFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(productPattern)];
  for (const match of matches) {
    const block = match[1];
    const nameMatch = namePattern.exec(block);
    if (!nameMatch) continue;
    const name = nameMatch[1].trim();
    const idMatch = idPattern.exec(block);
    const slugMatch = slugPattern.exec(block);
    const id = idMatch ? Number(idMatch[1]) : null;
    const slug = slugMatch ? slugMatch[1].trim() : null;
    const meta = { file: path.relative(process.cwd(), file), id, name, slug };
    if (id !== null) {
      duplicates.ids.set(id, [...(duplicates.ids.get(id) || []), meta]);
    }
    duplicates.names.set(name, [...(duplicates.names.get(name) || []), meta]);
    if (slug) duplicates.slugs.set(slug, [...(duplicates.slugs.get(slug) || []), meta]);
  }
}

function report(map) {
  return [...map.entries()].filter(([, values]) => values.length > 1);
}

console.log('DUPLICATE IDS', report(duplicates.ids).length);
console.log(JSON.stringify(report(duplicates.ids).slice(0, 100), null, 2));
console.log('DUPLICATE NAMES', report(duplicates.names).length);
console.log(JSON.stringify(report(duplicates.names).slice(0, 100), null, 2));
console.log('DUPLICATE SLUGS', report(duplicates.slugs).length);
console.log(JSON.stringify(report(duplicates.slugs).slice(0, 100), null, 2));
