const fs = require('fs')
const path = require('path')

const p = path.join(__dirname, '..', 'src', 'data', 'products.js')
const raw = fs.readFileSync(p, 'utf8')
const m = raw.match(/export const products = (\[.*\])$/s)
if (!m) {
  console.error('Could not parse products.js')
  process.exit(1)
}

const js = m[1]
// crude convert to JSON-ish
const normalized = js.replace(/(\w+):/g, '"$1":').replace(/'/g, '"')
let products
try {
  products = eval(normalized)
} catch (e) {
  console.error('Eval failed', e)
  process.exit(1)
}

const hosts = new Set()
products.forEach((prod) => {
  const pushUrl = (u) => {
    if (!u) return
    try {
      const url = new URL(u)
      hosts.add(url.hostname)
    } catch (e) {
      // not an absolute url
    }
  }
  if (prod.image) pushUrl(prod.image)
  if (prod.images && Array.isArray(prod.images)) prod.images.forEach(pushUrl)
})

console.log('External image hosts:')
Array.from(hosts).sort().forEach(h => console.log('-', h))
