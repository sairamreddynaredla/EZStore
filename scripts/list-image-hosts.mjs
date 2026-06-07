import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const modPath = path.join(__dirname, '..', 'src', 'data', 'products.js')

try {
  const productsModule = await import('file://' + modPath)
  const products = productsModule.products
  const hosts = new Set()
  products.forEach((prod) => {
    const pushUrl = (u) => {
      if (!u) return
      try {
        const url = new URL(u)
        hosts.add(url.hostname)
      } catch (e) {
        // not absolute
      }
    }
    if (prod.image) pushUrl(prod.image)
    if (prod.images && Array.isArray(prod.images)) prod.images.forEach(pushUrl)
  })

  console.log('External image hosts:')
  Array.from(hosts).sort().forEach(h => console.log('-', h))
} catch (e) {
  console.error('Error importing products module:', e.message)
  process.exit(1)
}
