const { Sequelize } = require("sequelize");
const User = require("./User");
const Product = require("./Product");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

User.initModel(sequelize);
Product.initModel(sequelize);

process.on("exit", () => {
  sequelize.close();
});

module.exports = { sequelize, User, Product };
