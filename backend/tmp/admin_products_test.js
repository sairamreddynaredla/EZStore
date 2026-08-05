// Use global fetch available in recent Node versions
(async () => {
  try {
    const base = 'http://localhost:5000';
    const loginRes = await fetch(`${base}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ezstore.com', password: 'admin123' }),
    });
    console.log('login status', loginRes.status);
    const loginJson = await loginRes.json();
    if (!loginJson.data || !loginJson.data.token) {
      console.error('Login failed', JSON.stringify(loginJson, null, 2));
      process.exit(1);
    }
    const token = loginJson.data.token;
    console.log('token obtained');

    const endpoints = [
      `/api/admin/products?page=1&limit=10&sortBy=title&order=asc`,
      `/api/admin/products?page=2&limit=10&sortBy=title&order=asc`,
      `/api/admin/products?page=1&limit=50&sortBy=title&order=asc`,
      `/api/admin/products?page=1&limit=10&q=premium&sortBy=title&order=asc`,
    ];

    for (const ep of endpoints) {
      const res = await fetch(base + ep, { headers: { Authorization: 'Bearer ' + token } });
      const body = await res.json();
      console.log(ep, 'status', res.status, 'total', body.data?.total ?? body.message ?? 'no-data');
    }

    console.log('API smoke tests complete');
  } catch (err) {
    console.error('Error', err);
    process.exit(1);
  }
})();
