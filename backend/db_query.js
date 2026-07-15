import sqlite from 'node:sqlite';

const dbPath = 'C:\\Users\\chand\\AppData\\Roaming\\pgAdmin\\pgadmin4.db';

try {
  const db = new sqlite.DatabaseSync(dbPath);
  console.log("Connected to pgadmin4.db SQLite database");
  
  const servers = db.prepare("SELECT * FROM server").all();
  console.log("Servers Details:");
  for (const s of servers) {
    console.log(JSON.stringify(s, null, 2));
  }
} catch (err) {
  console.error("Error reading pgadmin4.db:", err);
}
