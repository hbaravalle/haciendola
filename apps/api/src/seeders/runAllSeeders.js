require("dotenv").config();
// Recreating the tables needs the owner role; the API's role can only read
// and write rows.
if (process.env.DATABASE_ADMIN_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_ADMIN_URL;
}
const { sequelize } = require("../models");

async function runAllSeeders() {
  await sequelize.sync({ force: true });
  await require("./userSeeder")();
}

runAllSeeders();
