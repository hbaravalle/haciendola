// Drops and recreates every table, so the database starts empty. There's
// nothing to load: the demo account is created the first time someone opens
// the demo, and every other account when its login code is verified, each with
// its own copy of the catalog in src/data/products.json.
//
// Usage: node src/scripts/initDatabase.js
import "dotenv/config";
// Recreating the tables needs the owner role; the API's role can only read
// and write rows.
if (process.env.DATABASE_ADMIN_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_ADMIN_URL;
}
// Imported only now: static imports run before the code above, and the models
// read DATABASE_URL as soon as they load.
const { sequelize } = await import("../models/index.js");

await sequelize.sync({ force: true });
console.log("[DB] Tables created");
await sequelize.close();
