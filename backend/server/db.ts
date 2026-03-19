import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path - keeping it in root for now
const dbPath = path.join(__dirname, "../basera.db");
const db = new Database(dbPath);

// Initialize database
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT, -- 'student', 'owner', 'mess_owner'
      full_name TEXT
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER,
      type TEXT, -- 'pg', 'hostel', 'flat'
      name TEXT,
      location TEXT,
      price INTEGER,
      image TEXT,
      description TEXT,
      terms TEXT,
      contact TEXT,
      amenities TEXT,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER,
      name TEXT,
      location TEXT,
      price_per_month INTEGER,
      image TEXT,
      description TEXT,
      contact TEXT,
      menu TEXT,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      listing_id INTEGER,
      status TEXT DEFAULT 'pending_verification', -- 'pending', 'pending_verification', 'confirmed', 'rejected', 'cancelled'
      contact_number TEXT,
      move_in_date DATE,
      duration_months INTEGER,
      aadhar_card_url TEXT,
      college_id_url TEXT,
      declaration_url TEXT,
      booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(listing_id) REFERENCES listings(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      mess_id INTEGER,
      status TEXT DEFAULT 'active',
      start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(mess_id) REFERENCES messes(id)
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER,
      target_type TEXT, -- 'listing' or 'mess'
      target_id INTEGER,
      title TEXT,
      description TEXT,
      discount_percent INTEGER,
      expiry_date DATE,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    );
  `);

  // Migration for bookings table to add new columns if they don't exist
  try {
    const tableInfo = db.prepare("PRAGMA table_info(bookings)").all() as any[];
    const columns = tableInfo.map((c: any) => c.name);
    if (!columns.includes('contact_number')) {
      db.exec(`
        ALTER TABLE bookings ADD COLUMN contact_number TEXT;
        ALTER TABLE bookings ADD COLUMN move_in_date DATE;
        ALTER TABLE bookings ADD COLUMN duration_months INTEGER;
        ALTER TABLE bookings ADD COLUMN aadhar_card_url TEXT;
        ALTER TABLE bookings ADD COLUMN college_id_url TEXT;
        ALTER TABLE bookings ADD COLUMN declaration_url TEXT;
      `);
    }
  } catch (e) {
    console.error("Migration failed:", e);
  }

  // Migration for listings table to add gender column
  try {
    const tableInfo = db.prepare("PRAGMA table_info(listings)").all() as any[];
    const columns = tableInfo.map((c: any) => c.name);
    if (!columns.includes('gender')) {
      db.exec(`ALTER TABLE listings ADD COLUMN gender TEXT DEFAULT 'unisex'`);
    }
  } catch (e) {
    console.error("Listings Migration failed:", e);
  }

  // Seed data if empty
  const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare("INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)");
    insertUser.run('student1', 'password123', 'student', 'Rahul Sharma');
    insertUser.run('owner1', 'password123', 'owner', 'Mr. Gupta');
    insertUser.run('owner2', 'password123', 'owner', 'Mrs. Singh');
    insertUser.run('mess_owner1', 'password123', 'mess_owner', 'Chef Anand');
  }

  const listingCount = db.prepare("SELECT count(*) as count FROM listings").get() as { count: number };
  if (listingCount.count === 0) {
    const insertListing = db.prepare(`
      INSERT INTO listings (owner_id, type, name, location, price, image, description, terms, contact, amenities)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertListing.run(2, 'pg', 'Shree Ram PG', 'Koni Main Road, Near GGU Gate', 4500, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'Spacious rooms for students, walkable distance from Guru Ghasidas Vishwavidyalaya.', '1 month security deposit, No smoking, Gate closes at 10 PM.', '9876543210', 'WiFi, RO Water, Bed, Almirah');
    insertListing.run(2, 'hostel', 'GGU Boys Hostel (Private)', 'Birkona Road, Koni', 3500, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Affordable hostel for boys with mess facility included.', 'Advance payment required, ID proof mandatory.', '9123456789', 'Mess, Parking, 24/7 Water');
    insertListing.run(3, 'flat', '2BHK Student Flat', 'Ratanpur Road, Near Koni Thana', 8000, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'Perfect for a group of 4 students. Semi-furnished.', 'Electricity bill separate, 2 months deposit.', '8888877777', 'Kitchen, Balcony, Attached Washroom');
    insertListing.run(3, 'pg', 'Durga Girls PG', 'Koni, Near Science College', 5000, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', 'Safe and secure PG for girls with all basic amenities.', 'Girls only, Visitors allowed till 7 PM.', '7776665554', 'CCTV, Security, Laundry');
    insertListing.run(2, 'pg', 'Elite Boys PG', 'Near GGU Back Gate', 6000, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', 'Premium PG with AC and attached washrooms.', 'Security deposit 5000, 1 month notice.', '9990001112', 'AC, WiFi, Laundry, Power Backup');
    insertListing.run(3, 'hostel', 'Saraswati Girls Hostel', 'Koni Market Area', 4200, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 'Well-maintained hostel for girls with study room.', 'Strictly for students, ID required.', '8881112223', 'Study Room, WiFi, 24/7 Security');
    insertListing.run(2, 'flat', '1BHK Studio for Students', 'Birkona, Near Petrol Pump', 4500, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', 'Independent 1BHK, ideal for 2 students.', 'No brokerage, direct owner.', '7772223334', 'Kitchenette, Parking, RO Water');
  }

  const messCount = db.prepare("SELECT count(*) as count FROM messes").get() as { count: number };
  if (messCount.count === 0) {
    const insertMess = db.prepare(`
      INSERT INTO messes (owner_id, name, location, price_per_month, image, description, contact, menu)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMess.run(4, 'Annapurna Mess', 'Koni Main Market', 2500, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', 'Home-style food for students. Lunch and Dinner provided.', '9998887776', 'Dal, Chawal, Sabzi, Roti, Salad');
    insertMess.run(4, 'Student Delight Mess', 'Near GGU Back Gate', 2200, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', 'Budget friendly mess with special Sunday meals.', '8887776665', 'Veg Thali, Special Paneer on Sunday');
    insertMess.run(4, 'Gourmet Student Tiffin', 'Koni, Near Science College', 3000, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', 'Healthy and hygienic tiffin service delivered to your PG.', '7773334445', 'Mixed Veg, Paneer, Seasonal Fruits');
    insertMess.run(4, 'Birkona Student Mess', 'Birkona Road', 2100, 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=800&q=80', 'Affordable and clean mess for students living in Birkona.', '9991112223', 'Simple Veg Thali');
    insertMess.run(4, 'Koni Spice Junction', 'Near Koni Thana', 2600, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', 'Known for spicy and delicious North Indian food.', '8882223334', 'Aloo Paratha, Chole Bhature, Regular Thali');
  }
}

export default db;
