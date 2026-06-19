const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "data", "breeds.js");
let src = fs.readFileSync(filePath, "utf8");

const patterns = [
  /\n\s*tabs:\s*\[[\s\S]*?\],?/g,
  /\n\s*nutrition:\s*\{[\s\S]*?\},?/g,
  /\n\s*grooming:\s*\{[\s\S]*?\},?/g,
  /\n\s*training:\s*\{[\s\S]*?\},?/g,
  /\n\s*puppyCare:\s*\{[\s\S]*?\},?/g,
  /\n\s*lifestyle:\s*\{[\s\S]*?\},?/g,
  /\n\s*funFacts:\s*\[[\s\S]*?\],?/g,
  /\n\s*faqs:\s*\[[\s\S]*?\],?/g,
  /\n\s*relatedBreeds:\s*\[[\s\S]*?\],?/g,
];

patterns.forEach((pat) => {
  src = src.replace(pat, "");
});

// Tidy up multiple blank lines
src = src.replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(filePath, src, "utf8");
console.log("Removed specified fields from breeds.js");
