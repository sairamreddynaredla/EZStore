const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const srcData = path.join(repoRoot, 'src', 'data');
const productsPath = path.join(srcData, 'products.js');
const backupPath = productsPath + '.bak';
const tmpCjs = path.join(__dirname, '.tmp_products.cjs');

function readFile(p) { return fs.readFileSync(p, 'utf8'); }
function writeFile(p, c) { fs.writeFileSync(p, c, 'utf8'); }

console.log('Reading', productsPath);
const original = readFile(productsPath);

// Backup original
console.log('Creating backup:', backupPath);
writeFile(backupPath, original);

// Extract import mappings to replace variables with path strings
const importRegex = /^import\s+([\w_$]+)\s+from\s+['"](.*)['"];?$/gm;
let imports = {};
let match;
while ((match = importRegex.exec(original))) {
  imports[match[1]] = match[2];
}

// Build a temporary CommonJS file by removing import lines and converting export
let tmp = original.replace(importRegex, '');
tmp = tmp.replace(/export\s+const\s+products\s*=\s*/m, 'module.exports = ');

// Replace imported identifiers with their string paths
Object.keys(imports).forEach((ident) => {
  const p = imports[ident];
  const esc = ident.replace(/[$^\\.*+?()[\]{}|]/g, '\\$&');
  tmp = tmp.replace(new RegExp('\\b' + esc + '\\b', 'g'), JSON.stringify(p));
});

writeFile(tmpCjs, tmp);

console.log('Loading products from temporary module');
const products = require(tmpCjs);

if (!Array.isArray(products)) {
  console.error('Failed to load products array from temporary module.');
  process.exit(1);
}

// Analysis and migration
const report = { duplicateIds: [], duplicateProducts: [], missingImage: [], externalImage: [], duplicateImage: {}, counts: {} };

const idCounts = {};
products.forEach(p => { idCounts[p.id] = (idCounts[p.id]||0)+1; });
Object.keys(idCounts).forEach(k => { if (idCounts[k] > 1) report.duplicateIds.push({ id: k, count: idCounts[k] }); });

// Category prefix mapping
const counters = { DOG:1001, CAT:2001, BIRD:3001, FISH:4001, ACC:5001 };
const mapping = {};

function categoryKey(p){
  const cat = (p.petType || p.pet || p.category || '').toString().toLowerCase();
  if (cat.includes('dog') || cat.includes('dogs')) return 'DOG';
  if (cat.includes('cat') || cat.includes('cats')) return 'CAT';
  if (cat.includes('bird') || cat.includes('birds')) return 'BIRD';
  if (cat.includes('fish') || cat.includes('fishes')) return 'FISH';
  if (cat.includes('accessor') || cat.includes('acc') || (p.productCategory||'').toLowerCase().includes('accessor')) return 'ACC';
  // fallback: use pet
  const pet = (p.pet || '').toString().toLowerCase();
  if (pet === 'dog') return 'DOG';
  if (pet === 'cat') return 'CAT';
  if (pet === 'bird') return 'BIRD';
  if (pet === 'fish') return 'FISH';
  return 'ACC';
}

// Duplicate product detection by name+brand
const seenNameBrand = {};

// Image maps
const imageToIds = {};

// Create copies to avoid mutating original objects unexpectedly
const migrated = products.map(p => JSON.parse(JSON.stringify(p)));

migrated.forEach(p => {
  const oldId = p.id;
  const key = categoryKey(p);
  const newId = key + String(counters[key]++);
  mapping[oldId] = newId;
  p.id = newId;

  // relatedProducts update later after mapping built

  // duplicates by name+brand
  const nameKey = (p.name||'').trim().toLowerCase() + '||' + (p.brand||'').trim().toLowerCase();
  if (seenNameBrand[nameKey]) {
    report.duplicateProducts.push({ oldId, name: p.name, brand: p.brand, otherId: seenNameBrand[nameKey] });
  } else seenNameBrand[nameKey] = oldId;

  // image checks
  const img = p.image || '';
  if (!img) report.missingImage.push({ id: oldId, name: p.name });
  else {
    if (/^https?:\/\//i.test(img)) report.externalImage.push({ id: oldId, image: img });
    imageToIds[img] = imageToIds[img] || [];
    imageToIds[img].push(oldId);
  }
});

// Update relatedProducts arrays
migrated.forEach(p => {
  if (Array.isArray(p.relatedProducts)) {
    p.relatedProducts = p.relatedProducts.map(r => mapping[r] || r);
  }
});

// collect duplicate images
Object.keys(imageToIds).forEach(img => { if (imageToIds[img].length > 1) report.duplicateImage[img] = imageToIds[img]; });

// Split into categories
const groups = { dogs: [], cats: [], birds: [], fish: [], accessories: [] };
migrated.forEach(p => {
  const key = categoryKey(p);
  if (key === 'DOG') groups.dogs.push(p);
  else if (key === 'CAT') groups.cats.push(p);
  else if (key === 'BIRD') groups.birds.push(p);
  else if (key === 'FISH') groups.fish.push(p);
  else groups.accessories.push(p);
});

// Brands and categories
const brands = Array.from(new Set(migrated.map(p => p.brand).filter(Boolean))).sort();
const categories = Array.from(new Set(migrated.map(p => p.category).filter(Boolean))).sort();

// Ensure output directories
const outDir = path.join(srcData, 'products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function writeEsModuleArray(filePath, exportName, arr){
  const content = `export const ${exportName} = ${JSON.stringify(arr, null, 2)};\n`;
  writeFile(filePath, content);
}

writeEsModuleArray(path.join(outDir, 'dogs.js'), 'dogs', groups.dogs);
writeEsModuleArray(path.join(outDir, 'cats.js'), 'cats', groups.cats);
writeEsModuleArray(path.join(outDir, 'birds.js'), 'birds', groups.birds);
writeEsModuleArray(path.join(outDir, 'fish.js'), 'fish', groups.fish);
writeEsModuleArray(path.join(outDir, 'accessories.js'), 'accessories', groups.accessories);

// write brands and categories
writeFile(path.join(srcData, 'brands.js'), `export const brands = ${JSON.stringify(brands, null, 2)};\n`);
writeFile(path.join(srcData, 'categories.js'), `export const categories = ${JSON.stringify(categories, null, 2)};\n`);

// write mapping json
writeFile(path.join(srcData, 'products-id-mapping.json'), JSON.stringify(mapping, null, 2));

// write migration report
const reportLines = [];
reportLines.push('# Products Migration Report');
reportLines.push('\n## Summary');
reportLines.push(`- Total original products: ${products.length}`);
reportLines.push(`- Total migrated products: ${migrated.length}`);
reportLines.push(`- Duplicate numeric IDs found: ${report.duplicateIds.length}`);
reportLines.push(`- Duplicate products by name+brand: ${report.duplicateProducts.length}`);
reportLines.push(`- Products missing image: ${report.missingImage.length}`);
reportLines.push(`- Products with external image URLs: ${report.externalImage.length}`);
reportLines.push('\n## Duplicate Numeric IDs');
report.duplicateIds.forEach(d => reportLines.push(`- id ${d.id} count ${d.count}`));
reportLines.push('\n## Duplicate Products (name + brand)');
report.duplicateProducts.forEach(d => reportLines.push(`- oldId ${d.oldId} name: ${d.name} brand: ${d.brand} (duplicate of ${d.otherId})`));
reportLines.push('\n## Missing Images');
report.missingImage.forEach(d => reportLines.push(`- id ${d.id} name: ${d.name}`));
reportLines.push('\n## External Images');
report.externalImage.forEach(d => reportLines.push(`- id ${d.id} image: ${d.image}`));
reportLines.push('\n## Duplicate Images');
Object.keys(report.duplicateImage).forEach(img => {
  reportLines.push(`- image ${img} used by ids: ${report.duplicateImage[img].join(', ')}`);
});
reportLines.push('\n## ID Mapping (old -> new)');
Object.keys(mapping).forEach(oldId => reportLines.push(`- ${oldId} -> ${mapping[oldId]}`));

writeFile(path.join(repoRoot, 'migration-report.md'), reportLines.join('\n'));

// Replace src/data/products.js with a re-exporting module that preserves UI import
const newProductsJs = `import { dogs } from './products/dogs.js';\nimport { cats } from './products/cats.js';\nimport { birds } from './products/birds.js';\nimport { fish } from './products/fish.js';\nimport { accessories } from './products/accessories.js';\n\nexport const products = [...dogs, ...cats, ...birds, ...fish, ...accessories];\n`;

writeFile(productsPath, newProductsJs);

console.log('Migration complete. Files written:');
console.log('- products split into src/data/products/*.js');
console.log('- brands.js, categories.js, products-id-mapping.json, migration-report.md');
console.log('Backups: ', backupPath);

// cleanup tmp
try { fs.unlinkSync(tmpCjs); } catch(e){}

console.log('Done.');
