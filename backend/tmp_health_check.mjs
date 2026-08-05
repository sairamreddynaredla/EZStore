const base = 'http://localhost:5000';
const paths = [
  { method: 'GET', path: '/health' },
  { method: 'POST', path: '/api/admin/auth/login', body: { email: 'admin@example.com', password: 'test' } },
  { method: 'POST', path: '/api/admin/auth/forgot-password', body: { email: 'admin@example.com' } },
  { method: 'POST', path: '/api/admin/auth/reset-password', body: { token: 'dummy', password: 'Password123!' } }
];
for (const entry of paths) {
  const opts = { method: entry.method, headers: { 'Content-Type': 'application/json' } };
  if (entry.body) opts.body = JSON.stringify(entry.body);
  try {
    const res = await fetch(base + entry.path, opts);
    const text = await res.text();
    console.log(`${entry.method} ${entry.path} => ${res.status} ${text.slice(0,300)}`);
  } catch (err) {
    console.log(`${entry.method} ${entry.path} => ERROR ${err.message}`);
  }
}
