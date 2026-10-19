require("dotenv").config();
const { sequelize } = require("../models");

async function runAllSeeders() {
  await sequelize.sync({ force: true });
  await require("./productSeeder")();
  await require("./userSeeder")();
}

runAllSeeders();
