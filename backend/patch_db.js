import Database from "better-sqlite3";
const db = new Database("d:/basera/backend/basera.db");

// Patch existing seed rows
db.exec("UPDATE listings SET gender = 'male' WHERE name LIKE '%Boys%';");
db.exec("UPDATE listings SET gender = 'female' WHERE name LIKE '%Girls%';");
db.exec("UPDATE listings SET gender = 'unisex' WHERE name NOT LIKE '%Boys%' AND name NOT LIKE '%Girls%';");

console.log("Database patched successfully.");
