import Database from "better-sqlite3";
const db = new Database("d:/basera/backend/basera.db");

try {
    // Add columns if they don't exist
    db.exec(`
        ALTER TABLE messes ADD COLUMN fssai_license TEXT;
        ALTER TABLE messes ADD COLUMN owner_aadhar TEXT;
    `);
    console.log("Successfully added new columns to messes table.");
} catch (err) {
    if (err.message.includes("duplicate column name")) {
        console.log("Columns already exist, skipping.");
    } else {
        console.error("Migration error:", err);
    }
}
