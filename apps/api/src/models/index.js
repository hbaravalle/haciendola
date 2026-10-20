import { Sequelize } from "sequelize";
import pg from "pg";
import User from "./User.js";
import Product from "./Product.js";
import LoginCode from "./LoginCode.js";
import RateLimit from "./RateLimit.js";

// pg returns BIGINT as a string; these values fit in a JS number.
pg.types.setTypeParser(20, Number);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  // Vercel's bundler can't see Sequelize's dynamic require of pg.
  dialectModule: pg,
  dialectOptions: {
    ssl: { require: true },
  },
  // One request per function: a couple of connections is enough.
  pool: process.env.VERCEL ? { max: 2, idle: 1000 } : undefined,
  logging: false,
});

User.initModel(sequelize);
Product.initModel(sequelize);
LoginCode.initModel(sequelize);
RateLimit.initModel(sequelize);

User.hasMany(Product, { foreignKey: "user_id", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "user_id" });

process.on("exit", () => {
  sequelize.close();
});

export { sequelize, User, Product, LoginCode, RateLimit };
