const fetch = globalThis.fetch || require('node:undici').fetch;
(async () => {
  try {
    const login = await fetch('http://localhost:5000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ezstore.com', password: 'admin123' }),
    });
    console.log('LOGIN_STATUS', login.status);
    const loginText = await login.text();
    console.log('LOGIN_RESPONSE', loginText);
    const obj = JSON.parse(loginText);
    if (!obj.token) {
      console.error('NO_TOKEN');
      process.exit(1);
    }
    const summary = await fetch('http://localhost:5000/api/admin/dashboard/summary', {
      headers: { Authorization: `Bearer ${obj.token}` },
    });
    console.log('SUMMARY_STATUS', summary.status);
    console.log('SUMMARY_RESPONSE', await summary.text());
  } catch (err) {
    console.error('ERROR', err.message);
    process.exit(1);
  }
})();