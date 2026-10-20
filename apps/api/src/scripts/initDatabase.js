// Drops and recreates every table. Accounts are created on login.
// Usage: node src/scripts/initDatabase.js
import "dotenv/config";
// Needs the owner role.
if (process.env.DATABASE_ADMIN_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_ADMIN_URL;
}
// Dynamic import: a static one would run before the override above.
const { sequelize } = await import("../models/index.js");

await sequelize.sync({ force: true });
console.log("[DB] Tables created");
await sequelize.close();
