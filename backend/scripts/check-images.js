import http from 'http';

const token = process.env.EZSTORE_ADMIN_TOKEN;

if (!token) {
  throw new Error('Set EZSTORE_ADMIN_TOKEN before running this diagnostic script.');
}

const req = http.request({
  host: 'localhost',
  port: 5000,
  path: '/api/admin/products?page=1&limit=5',
  method: 'GET',
  headers: { Authorization: 'Bearer ' + token }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('API Response:', JSON.stringify(json, null, 2));
    if (!json.data || !Array.isArray(json.data)) {
      console.log('ERROR: Response.data is not an array');
      return;
    }
    console.log('✓ Backend returns:', json.data.length, 'products\n');
    json.data.forEach((p, i) => {
      console.log(`Product ${i + 1}: ${p.title}`);
      console.log(`  - id: ${p.id}`);
      console.log(`  - image: ${p.image || '(null)'}`);
      console.log(`  - imageUrl: ${p.imageUrl || '(null)'}`);
      console.log(`  - images.length: ${p.images?.length || 0}`);
      if (p.images?.length > 0) {
        console.log(`    - images[0]: ${p.images[0]}`);
      }
      console.log();
    });
  });
});

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.end();
