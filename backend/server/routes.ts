import { Router } from "express";
import db from "./db.js";

const router = Router();

// Auth Routes
router.post("/auth/signup", (req, res) => {
  const { username, password, full_name, role } = req.body;
  try {
    const info = db.prepare(
      "INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)"
    ).run(username, password, full_name, role);

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
    res.json({ success: true, user });
  } catch (err: any) {
    if (err.message.includes("UNIQUE constraint failed: users.username")) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

router.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
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

router.post("/messes", (req, res) => {
  const { owner_id, name, location, price_per_month, menu, image } = req.body;
  try {
    const info = db.prepare(
      "INSERT INTO messes (owner_id, name, location, price_per_month, menu, image) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(owner_id, name, location, price_per_month, menu, image);
    const mess = db.prepare("SELECT * FROM messes WHERE id = ?").get(info.lastInsertRowid);
    res.json(mess);
  } catch (err) {
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

router.post("/listings", (req, res) => {
  const { owner_id, type, name, location, price, image, description, terms, contact, amenities } = req.body;
  const info = db.prepare(`
    INSERT INTO listings (owner_id, type, name, location, price, image, description, terms, contact, amenities)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(owner_id, type, name, location, price, image, description, terms, contact, amenities);
  res.json({ id: info.lastInsertRowid });
});

router.delete("/listings/:id", (req, res) => {
  db.prepare("DELETE FROM listings WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;
