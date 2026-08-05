import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: './.env' });
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  const tables = await client.query("select table_name from information_schema.tables where table_schema='public' order by table_name");
  console.log('TABLES');
  console.log(JSON.stringify(tables.rows, null, 2));
  const prismaTables = await client.query("select table_name from information_schema.tables where table_schema='public' and table_name ilike '%prisma%' order by table_name");
  console.log('PRISMA_TABLES');
  console.log(JSON.stringify(prismaTables.rows, null, 2));
  try {
    const m1 = await client.query('select * from prisma_migrations order by finished_at desc');
    console.log('DB_MIGRATIONS_PRISMA');
    console.log(JSON.stringify(m1.rows, null, 2));
  } catch (e) {
    console.error('ERROR_PRISMA_MIGRATIONS', e.message);
  }
  try {
    const m2 = await client.query('select * from _prisma_migrations order by finished_at desc');
    console.log('DB_MIGRATIONS__PRISMA');
    console.log(JSON.stringify(m2.rows, null, 2));
  } catch (e) {
    console.error('ERROR__PRISMA_MIGRATIONS', e.message);
  }
  const admin = await client.query("select column_name, data_type, is_nullable from information_schema.columns where table_name='Admin' order by ordinal_position");
  console.log('ADMIN_COLUMNS');
  console.log(JSON.stringify(admin.rows, null, 2));
  const customer = await client.query("select column_name, data_type, is_nullable from information_schema.columns where table_name='Customer' order by ordinal_position");
  console.log('CUSTOMER_COLUMNS');
  console.log(JSON.stringify(customer.rows, null, 2));
} catch (err) {
  console.error('ERROR', err);
  process.exit(1);
} finally {
  await client.end();
}
