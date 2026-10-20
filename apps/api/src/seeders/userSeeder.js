import { sequelize, User } from "../models/index.js";
import * as catalogService from "../services/catalogService.js";

async function userSeeder() {
  try {
    const users = [
      { name: "Luke Skywalker", email: "luke@starwars.com" },
      { name: "Leia Organa", email: "leia@starwars.com" },
      { name: "Han Solo", email: "han@starwars.com" },
    ];

    // Each test user gets their own copy of the catalog, like a new account.
    for (const fields of users) {
      await sequelize.transaction(async (transaction) => {
        const user = await User.create(fields, { transaction });
        await catalogService.seedCatalog(user, { transaction });
      });
    }
    console.log("[Seeder] Users and their catalogs created");
  } catch (err) {
    console.log(err);
  }
}

export default userSeeder;
