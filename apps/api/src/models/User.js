const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
        },
        username: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING(100),
          unique: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        otp: {
          type: DataTypes.STRING(6),
        },
      },
      {
        sequelize,
        modelName: "user",
        timestamps: true,
        underscored: true,
        paranoid: true,
        hooks: {
          beforeSave: (user) => {
            if (user.changed("password")) {
              const hashedPassword = bcrypt.hashSync(
                user.password,
                bcrypt.genSaltSync(10)
              );
              user.password = hashedPassword;
            }
          },
        },
      }
    );

    User.prototype.validatePassword = async function (password) {
      try {
        return await bcrypt.compare(password, this.password);
      } catch (error) {
        throw new Error("Error validating password");
      }
    };

    return User;
  }
}

module.exports = User;
