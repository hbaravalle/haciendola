import "dotenv/config";
// Recreating the tables needs the owner role; the API's role can only read
// and write rows.
if (process.env.DATABASE_ADMIN_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_ADMIN_URL;
}
// Imported only now: static imports run before the code above, and the models
// read DATABASE_URL as soon as they load.
const { sequelize } = await import("../models/index.js");
const { default: userSeeder } = await import("./userSeeder.js");

await sequelize.sync({ force: true });
await userSeeder();
