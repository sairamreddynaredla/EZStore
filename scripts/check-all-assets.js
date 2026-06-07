const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const base = 'http://localhost:5174';
const assetsDir = path.join(__dirname, '..', 'src', 'assets');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });
  return results;
}

(async () => {
  const files = walk(assetsDir);
  for (const f of files) {
    const rel = path.relative(path.join(__dirname, '..', 'src'), f).split(path.sep).join('/');
    const url = base + '/src/' + rel;
    try {
      const r = await fetch(url, { method: 'GET' });
      if (r.status >= 400) {
        // try with ?import for images
        const r2 = await fetch(url + '?import', { method: 'GET' }).catch(()=>null);
        console.log(rel, '=>', r.status, r.headers.get('content-type'), r2 ? `tryImport:${r2.status}` : 'tryImport:ERR');
      } else {
        console.log(rel, '=>', r.status, r.headers.get('content-type'));
      }
    } catch (e) {
      console.log(rel, '=> ERROR', e.message);
    }
  }
})();
