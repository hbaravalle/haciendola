require("dotenv").config();
const { User } = require("../models");

async function userSeeder() {
  try {
    const users = [
      {
        name: "Luke Skywalker",
        username: "lukeskywalker",
        email: "luke@starwars.com",
        password: process.env.SEEDER_USER_PASS,
      },
      {
        name: "Leia Organa",
        username: "leiaorgana",
        email: "leia@starwars.com",
        password: process.env.SEEDER_USER_PASS,
      },
      {
        name: "Han Solo",
        username: "hansolo",
        email: "han@starwars.com",
        password: process.env.SEEDER_USER_PASS,
      },
    ];

    await User.bulkCreate(users, { individualHooks: true });
    console.log("[Seeder] Users created");
  } catch (err) {
    console.log(err);
  }
}

module.exports = userSeeder;
