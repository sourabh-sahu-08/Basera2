import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "basera.db");

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

try {
  db.transaction(() => {
    // Find IDs of dummy listings
    const dummyIds = db.prepare("SELECT id FROM listings WHERE name LIKE '%dummy%' OR location LIKE '%dummy%' OR description LIKE '%dummy%' OR name = 'owner'").all().map(r => r.id);
    
    if (dummyIds.length > 0) {
      const placeholders = dummyIds.map(() => '?').join(',');
      
      // Delete from dependent tables
      // For 'messages', we delete any message linked to these listings
      db.prepare(`DELETE FROM messages WHERE listing_id IN (${placeholders})`).run(...dummyIds);
      
      // For 'bookings', we delete any booking for these listings
      db.prepare(`DELETE FROM bookings WHERE listing_id IN (${placeholders})`).run(...dummyIds);
      
      // For 'offers', check if there are any linked to these listings
      db.prepare(`DELETE FROM offers WHERE target_type = 'listing' AND target_id IN (${placeholders})`).run(...dummyIds);

      // Finally delete the listings
      const result = db.prepare(`DELETE FROM listings WHERE id IN (${placeholders})`).run(...dummyIds);
      console.log(`Successfully removed ${result.changes} dummy listings and their related messages/bookings/offers.`);
    } else {
      console.log("No dummy listings found to remove.");
    }
  })();
} catch (e) {
  console.error("Cleanup failed:", e.message);
} finally {
  db.close();
}
