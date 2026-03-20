import { Router } from "express";
import db from "./db.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only .png, .jpg, .jpeg and .pdf format allowed!"));
  },
});

const router = Router();

// Auth Routes
router.post("/auth/signup", (req, res) => {
  const { email, phone_number, password, full_name, role } = req.body;
  try {
    const info = db.prepare(
      "INSERT INTO users (email, phone_number, password, full_name, role) VALUES (?, ?, ?, ?, ?)"
    ).run(email, phone_number, password, full_name, role);

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
    res.json({ success: true, user });
  } catch (err: any) {
    if (err.message.includes("UNIQUE constraint failed: users.email")) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

router.get("/users", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json(users);
});

router.get("/listings", (req, res) => {
  const listings = db.prepare("SELECT * FROM listings").all();
  res.json(listings);
});

// Messes
router.get("/messes", (req, res) => {
  const messes = db.prepare("SELECT * FROM messes").all();
  res.json(messes);
});

router.post("/messes", upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'fssai_license', maxCount: 1 },
  { name: 'owner_aadhar', maxCount: 1 }
]), (req, res) => {
  const { owner_id, name, location, price_per_month, menu } = req.body;
  
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Process Images array
    let imagePaths: string[] = [];
    if (files.images && files.images.length > 0) {
      imagePaths = files.images.map(f => "/uploads/" + f.filename);
    }
    const imageString = JSON.stringify(imagePaths);

    // Process Documents
    const fssaiPath = files.fssai_license && files.fssai_license.length > 0 
      ? "/uploads/" + files.fssai_license[0].filename : null;
    const aadharPath = files.owner_aadhar && files.owner_aadhar.length > 0 
      ? "/uploads/" + files.owner_aadhar[0].filename : null;

    const info = db.prepare(
      "INSERT INTO messes (owner_id, name, location, price_per_month, menu, image, fssai_license, owner_aadhar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(owner_id, name, location, price_per_month, menu, imageString, fssaiPath, aadharPath);
    
    const mess = db.prepare("SELECT * FROM messes WHERE id = ?").get(info.lastInsertRowid);
    res.json(mess);
  } catch (err) {
    console.error("Mess creation error:", err);
    res.status(500).json({ error: "Failed to create mess" });
  }
});

router.put("/messes/:id/menu", (req, res) => {
  const { menu } = req.body;
  db.prepare("UPDATE messes SET menu = ? WHERE id = ?").run(menu, req.params.id);
  res.json({ success: true });
});

router.put("/bookings/:id/status", (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

router.get("/owner/listings/:ownerId", (req, res) => {
  const listings = db.prepare("SELECT * FROM listings WHERE owner_id = ?").all(req.params.ownerId);
  res.json(listings);
});

router.get("/owner/bookings/:ownerId", (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, u.full_name as student_name, l.name as property_name 
    FROM bookings b
    JOIN users u ON b.student_id = u.id
    JOIN listings l ON b.listing_id = l.id
    WHERE l.owner_id = ?
  `).all(req.params.ownerId);
  res.json(bookings);
});

router.get("/owner/subscriptions/:ownerId", (req, res) => {
  const subs = db.prepare(`
    SELECT s.*, u.full_name as student_name, m.name as mess_name 
    FROM subscriptions s
    JOIN users u ON s.student_id = u.id
    JOIN messes m ON s.mess_id = m.id
    WHERE m.owner_id = ?
  `).all(req.params.ownerId);
  res.json(subs);
});

router.get("/student/bookings/:studentId", (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, l.name as property_name, l.location, l.price, l.image
    FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    WHERE b.student_id = ?
  `).all(req.params.studentId);
  res.json(bookings);
});

router.get("/student/subscriptions/:studentId", (req, res) => {
  const subs = db.prepare(`
    SELECT s.*, m.name as mess_name, m.location, m.price_per_month, m.image
    FROM subscriptions s
    JOIN messes m ON s.mess_id = m.id
    WHERE s.student_id = ?
  `).all(req.params.studentId);
  res.json(subs);
});

router.post("/bookings", (req, res) => {
  const { student_id, listing_id } = req.body;
  const info = db.prepare("INSERT INTO bookings (student_id, listing_id) VALUES (?, ?)").run(student_id, listing_id);
  res.json({ id: info.lastInsertRowid });
});

router.post("/subscriptions", (req, res) => {
  const { student_id, mess_id } = req.body;
  const info = db.prepare("INSERT INTO subscriptions (student_id, mess_id) VALUES (?, ?)").run(student_id, mess_id);
  res.json({ id: info.lastInsertRowid });
});

router.get("/offers", (req, res) => {
  const offers = db.prepare("SELECT * FROM offers").all();
  res.json(offers);
});

router.post("/offers", (req, res) => {
  const { owner_id, target_type, target_id, title, description, discount_percent, expiry_date } = req.body;
  const info = db.prepare(`
    INSERT INTO offers (owner_id, target_type, target_id, title, description, discount_percent, expiry_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(owner_id, target_type, target_id, title, description, discount_percent, expiry_date);
  res.json({ id: info.lastInsertRowid });
});

router.put("/messes/:id/menu", (req, res) => {
  const { menu } = req.body;
  db.prepare("UPDATE messes SET menu = ? WHERE id = ?").run(menu, req.params.id);
  res.json({ success: true });
});

router.put("/bookings/:id/status", (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

router.get("/owner/messes/:ownerId", (req, res) => {
  const messes = db.prepare("SELECT * FROM messes WHERE owner_id = ?").all(req.params.ownerId);
  res.json(messes);
});

router.post("/listings", upload.array('images', 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 4) {
      return res.status(400).json({ error: "At least 4 property images are required." });
    }
    const imageUrls = files.map(file => '/uploads/' + file.filename);
    const imageString = JSON.stringify(imageUrls);

    const { owner_id, type, name, location, price, description, terms, contact, amenities, gender } = req.body;
    const info = db.prepare(`
      INSERT INTO listings (owner_id, type, name, location, price, image, description, terms, contact, amenities, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(owner_id, type, name, location, price, imageString, description, terms, contact, amenities, gender || 'unisex');
    
    res.json({ id: info.lastInsertRowid });
  } catch (error: any) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get("/listings/:id", (req, res) => {
  const parsedId = parseInt(req.params.id, 10);
  const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(parsedId);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  res.json(listing);
});

router.delete("/listings/:id", (req, res) => {
  db.prepare("DELETE FROM listings WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/bookings/secure", upload.fields([
  { name: 'aadhar_card', maxCount: 1 },
  { name: 'college_id', maxCount: 1 },
  { name: 'declaration', maxCount: 1 }
]), (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { student_id, listing_id, contact_number, move_in_date, duration_months } = req.body;
    
    // Check if required files are present
    if (!files['aadhar_card'] || !files['college_id'] || !files['declaration']) {
      return res.status(400).json({ error: "All required documents must be uploaded" });
    }

    const aadhar_card_url = '/uploads/' + files['aadhar_card'][0].filename;
    const college_id_url = '/uploads/' + files['college_id'][0].filename;
    const declaration_url = '/uploads/' + files['declaration'][0].filename;

    const info = db.prepare(`
      INSERT INTO bookings (student_id, listing_id, status, contact_number, move_in_date, duration_months, aadhar_card_url, college_id_url, declaration_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      student_id, listing_id, 'pending_verification', contact_number, move_in_date, duration_months,
      aadhar_card_url, college_id_url, declaration_url
    );

    res.json({ id: info.lastInsertRowid });
  } catch (error: any) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete("/bookings/:id", (req, res) => {
  db.prepare("DELETE FROM bookings WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Messages
router.get("/messages/:listing_id/:user1/:user2", (req, res) => {
  const listingId = parseInt(req.params.listing_id, 10);
  const user1 = parseInt(req.params.user1, 10);
  const user2 = parseInt(req.params.user2, 10);
  
  const messages = db.prepare(`
    SELECT * FROM messages 
    WHERE listing_id = ? 
    AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
    ORDER BY created_at ASC
  `).all(listingId, user1, user2, user2, user1);
  
  res.json(messages);
});

router.get("/conversations/:user_id", (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  
  // Gets all distinct conversations for an owner (or student if they have multiple)
  // This uses a subquery to get the latest message content and timestamp
  const conversations = db.prepare(`
    SELECT 
      m.listing_id,
      l.name as listing_name,
      l.owner_id,
      CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END as student_id,
      u.full_name as student_name,
      MAX(m.created_at) as last_message_date,
      (SELECT content FROM messages m2 WHERE m2.listing_id = m.listing_id 
        AND (m2.sender_id = u.id OR m2.receiver_id = u.id) 
        ORDER BY created_at DESC LIMIT 1) as last_message
    FROM messages m
    JOIN listings l ON m.listing_id = l.id
    JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
    WHERE l.owner_id = ? OR m.sender_id = ? OR m.receiver_id = ?
    GROUP BY m.listing_id, student_id
    ORDER BY last_message_date DESC
  `).all(userId, userId, userId, userId, userId);
  
  res.json(conversations);
});

router.post("/messages", (req, res) => {
  const { listing_id, sender_id, receiver_id, content } = req.body;
  const info = db.prepare(`
    INSERT INTO messages (listing_id, sender_id, receiver_id, content)
    VALUES (?, ?, ?, ?)
  `).run(listing_id, sender_id, receiver_id, content);
  
  const newMessage = db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid);
  res.json(newMessage);
});

export default router;
