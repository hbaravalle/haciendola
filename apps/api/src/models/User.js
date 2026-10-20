const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
        },
        // The email is the user's identity: the login code is sent there.
        // Stored lowercased so lookups don't depend on how it was typed.
        email: {
          type: DataTypes.STRING(254),
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
          set(value) {
            this.setDataValue("email", String(value).trim().toLowerCase());
          },
        },
        // When the user's catalog was last filled with the seed products.
        catalog_seeded_at: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: "user",
        timestamps: true,
        underscored: true,
        paranoid: true,
      }
    );

    return User;
  }
}

module.exports = User;
