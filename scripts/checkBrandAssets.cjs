const fs = require('fs')
const path = require('path')

const brandsDir = path.join(__dirname, '..', 'src', 'assets', 'brands')
const brandsFile = path.join(__dirname, '..', 'src', 'data', 'brands.js')

const normalize = (s) => String(s || '')
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/(^-|-$)/g, '')

function listAssets() {
  if (!fs.existsSync(brandsDir)) {
    console.error('brands dir not found:', brandsDir)
    process.exit(1)
  }
  const files = fs.readdirSync(brandsDir)
  const items = files.filter(f => /\.(png|jpe?g|webp|svg)$/i.test(f))
  const mapped = items.map(f => {
    const name = f.replace(/\.(png|jpe?g|webp|svg)$/i, '')
    return { file: f, key: normalize(name), compact: normalize(name).replace(/-/g, '') }
  })
  return mapped
}

function listBrands() {
  if (!fs.existsSync(brandsFile)) {
    console.error('brands file not found:', brandsFile)
    process.exit(1)
  }
  const txt = fs.readFileSync(brandsFile,'utf8')
  const logos = []
  const re = /logo:\s*'([^']+)'/g
  let m
  while ((m = re.exec(txt)) !== null) {
    logos.push(m[1])
  }
  return logos
}

const assets = listAssets()
const brandLogos = listBrands()

console.log('\nFound asset files:')
assets.forEach(a => console.log(' -', a.file, '=>', a.key))

console.log('\nBrand logo keys from data/brands.js:')
brandLogos.forEach(b => console.log(' -', b))

const assetKeys = new Set(assets.map(a => a.key))
const assetComp = new Set(assets.map(a => a.compact))

const missing = []
brandLogos.forEach(b => {
  const k = normalize(b)
  const kcomp = k.replace(/-/g, '')
  if (!assetKeys.has(k) && !assetComp.has(kcomp)) missing.push(b)
})

if (missing.length === 0) {
  console.log('\nAll brand logos have a matching asset (by loose match).')
} else {
  console.log('\nMissing assets for these brand.logo keys:')
  missing.forEach(m => console.log(' -', m))
}

console.log('\nDone.')
