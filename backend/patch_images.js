import Database from "better-sqlite3";
const db = new Database("d:/basera/backend/basera.db");

// Patch Listings with specific realistic images
const updates = [
    { name: 'Shree Ram PG', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
    { name: 'GGU Boys Hostel (Private)', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80' },
    { name: '2BHK Student Flat', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80' },
    { name: 'Durga Girls PG', url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80' },
    { name: 'Elite Boys PG', url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80' },
    { name: 'Saraswati Girls Hostel', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80' },
    { name: '1BHK Studio for Students', url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80' }
];

for (const prop of updates) {
    db.prepare('UPDATE listings SET image = ? WHERE name = ?').run(prop.url, prop.name);
}

// Patch Messes
const messUpdates = [
    { name: 'Annapurna Mess', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80' },
    { name: 'Student Delight Mess', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80' },
    { name: 'Gourmet Student Tiffin', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80' },
    { name: 'Birkona Student Mess', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80' },
    { name: 'Koni Spice Junction', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80' }
];

for (const mess of messUpdates) {
    db.prepare('UPDATE messes SET image = ? WHERE name = ?').run(mess.url, mess.name);
}

console.log('Images patched successfully.');
