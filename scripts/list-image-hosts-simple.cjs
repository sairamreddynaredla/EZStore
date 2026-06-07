const fs = require('fs')
const path = require('path')

const p = path.join(__dirname, '..', 'src', 'data', 'products.js')
const raw = fs.readFileSync(p, 'utf8')

const urlRegex = /https?:\/\/[^"'\s,\)\]]+/g
const matches = raw.match(urlRegex) || []
const hosts = new Set()
matches.forEach((m) => {
  try {
    const u = new URL(m)
    hosts.add(u.hostname)
  } catch (e) {}
})

console.log('Found', matches.length, 'URLs. External image hosts:')
Array.from(hosts).sort().forEach(h => console.log('-', h))
