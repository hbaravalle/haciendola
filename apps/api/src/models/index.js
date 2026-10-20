import { Sequelize } from "sequelize";
import pg from "pg";
import User from "./User.js";
import Product from "./Product.js";
import LoginCode from "./LoginCode.js";
import RateLimit from "./RateLimit.js";

// pg returns BIGINT (OID 20) as a string. ids, SKUs and barcodes fit in a JS
// number, so parse them to keep the API returning numbers.
pg.types.setTypeParser(20, Number);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  // Passed directly because Sequelize loads pg with a dynamic require that
  // Vercel's bundler can't see, and the function would fail without it.
  dialectModule: pg,
  dialectOptions: {
    ssl: { require: true },
  },
  // A Vercel function handles one request at a time, so it only needs a
  // couple of connections; Neon's pooler shares them between instances.
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
