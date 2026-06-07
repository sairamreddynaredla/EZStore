const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const base = 'http://localhost:5174';
const paths = [
  '/src/assets/brands/purina.jpeg?import',
  '/src/assets/brands/drools.jpeg?import',
  '/src/assets/brands/kennel-kitchen.jpeg?import',
  '/src/assets/brands/sheba.jpeg?import',
  '/src/assets/brands/taste-of-the-wild.jpeg?import',
  '/src/assets/logo/ezstore-logo-optimized.png',
  '/src/assets/banners/fresh-food-banner.jpeg',
  '/src/data/blogs.js',
  '/src/data/breeds.js',
  '/src/components/BrandsDropdown.jsx'
];

(async () => {
  for (const p of paths) {
    try {
      const url = base + p;
      const res = await fetch(url, { method: 'GET' });
      console.log(p, '=>', res.status, res.headers.get('content-type'));
    } catch (e) {
      console.log(p, '=> ERROR', e.message);
    }
  }
})();
