import Database from 'better-sqlite3';
const db = new Database('basera.db'); // THE REAL DB

try {
  const userId = 2; // owner1 in db.ts seed is 2
  
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
  
  console.log("Conversations found:", conversations);
} catch (error) {
  console.error("SQL Error:", error);
}

try {
  console.log("All messages:", db.prepare("SELECT * FROM messages").all());
} catch (e) {
  console.error(e);
}
