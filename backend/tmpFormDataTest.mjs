import axios from 'axios';
import FormData from 'form-data';

const run = async () => {
  const login = await axios.post('http://localhost:5000/api/admin/auth/login', {
    email: 'admin@ezstore.com',
    password: 'admin123',
  });
  const token = login.data.data.token;

  const form = new FormData();
  form.append('title', 'Browser FormData Test');
  form.append('description', 'Testing exact browser FormData path');
  form.append('price', '19.99');
  form.append('category', 'Test Category');
  form.append('brand', 'Test Brand');
  form.append('stock', '5');
  form.append('status', 'active');
  form.append('tags', JSON.stringify(['test']));
  form.append('existingImages', JSON.stringify(['https://example.com/old.png']));
  form.append('imageUrl', 'https://example.com/image.png');
  form.append('images', Buffer.from([137,80,78,71,13,10,26,10]), 'test.png');

  try {
    const res = await axios.put('http://localhost:5174/api/admin/products/29', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
    });
    console.log('STATUS', res.status);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('ERROR', err?.response?.status, err?.response?.data || err.message);
    if (err?.response?.headers) console.error('HEADERS', err.response.headers);
    if (err?.request) console.error('REQUESTED');
    process.exit(1);
  }
};

run();
