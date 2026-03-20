import Database from "better-sqlite3";
const db = new Database("d:/basera/backend/basera.db");

const messes = db.prepare("SELECT id, menu FROM messes").all();
const stmt = db.prepare("UPDATE messes SET menu = ? WHERE id = ?");

let updatedCount = 0;
for (const mess of messes) {
  let menuStr = mess.menu;
  if (!menuStr || menuStr.trim() === '') {
    menuStr = "Standard Chef's Menu";
  }
  
  // Skip if already JSON
  try {
    const parsed = JSON.parse(menuStr);
    if (typeof parsed === 'object' && parsed !== null && 'monday' in parsed) {
        continue;
    }
  } catch (e) {
    // Normal string, convert to JSON
  }
  
  const newMenu = {
    monday: menuStr,
    tuesday: menuStr,
    wednesday: menuStr,
    thursday: menuStr,
    friday: menuStr,
    saturday: menuStr,
    sunday: menuStr
  };
  stmt.run(JSON.stringify(newMenu), mess.id);
  updatedCount++;
}

console.log(`Messes menu patched successfully to JSON format. Updated ${updatedCount} rows.`);
