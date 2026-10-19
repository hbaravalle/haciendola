const { User } = require("../models");
const { Op } = require("sequelize");

async function find(userIdentifier) {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: userIdentifier }, { email: userIdentifier }],
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    console.log(err);
  }
}

async function create(data) {
  try {
    const newUser = await User.create({
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return newUser;
  } catch (err) {
    throw new Error("Cannot create user");
  }
}

module.exports = { find, create };
