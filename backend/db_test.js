import pg from 'pg';

const candidateUrls = [
  'postgresql://postgres@127.0.0.1:5432/postgres',
  'postgresql://grahvani@127.0.0.1:5432/grahvani',
  'postgresql://postgres:password@127.0.0.1:5432/postgres',
  'postgresql://grahvani:password@127.0.0.1:5432/grahvani',
];

async function testConnection(url) {
  // Let's configure client
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 2000 });
  try {
    await client.connect();
    console.log(`SUCCESS: Connected using ${url}`);
    const res = await client.query("SELECT datname FROM pg_database");
    console.log("Existing databases:", res.rows.map(r => r.datname));
    await client.end();
    return true;
  } catch (err) {
    console.log(`FAILED: ${url} -> ${err.message}`);
    try {
      await client.end();
    } catch (e) {}
    return false;
  }
}

async function run() {
  for (const url of candidateUrls) {
    const success = await testConnection(url);
    if (success) {
      console.log("\nFound a working connection URL!");
      break;
    }
  }
}

run();
