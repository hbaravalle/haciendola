import { Model, DataTypes } from "sequelize";

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
        // Stored lowercased; the login code is sent here.
        email: {
          type: DataTypes.STRING(254),
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
          set(value) {
            this.setDataValue("email", String(value).trim().toLowerCase());
          },
        },
        // Last time the catalog was seeded.
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

export default User;
