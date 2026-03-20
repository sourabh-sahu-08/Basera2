import Database from "better-sqlite3";
const db = new Database("d:/basera/backend/basera.db");
db.exec("PRAGMA foreign_keys = OFF;");
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
for (const table of tables) {
  if (table.name !== 'sqlite_sequence') {
     console.log('Dropping', table.name);
     db.exec(`DROP TABLE ${table.name}`);
  }
}
console.log("Database cleared.");
