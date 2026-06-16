const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'src', 'data', 'breeds.js')
let src = fs.readFileSync(filePath, 'utf8')

const markers = [
  'TAB BUTTONS',
  'NUTRITION SECTION',
  'GROOMING SECTION',
  'TRAINING SECTION',
  'PUPPY CARE',
  'LIFESTYLE',
  'FUN FACTS',
  'FAQ',
  'RELATED BREEDS',
]

markers.forEach((marker) => {
  const re = new RegExp("\\n\\s*//\\s*" + marker + "[\\s\\S]*?(?=\\n\\s*//|\\n\\s*},|$)", 'gmi')
  src = src.replace(re, '\n')
})

// Remove leftover empty arrays or commas from aggressive removals
src = src.replace(/\[,\s*\]/g, '[]')
src = src.replace(/,\s*\n\s*},/g, '\n  },')
src = src.replace(/\n{3,}/g, '\n\n')

fs.writeFileSync(filePath, src, 'utf8')
console.log('Cleaned leftover breed section fragments in breeds.js')
