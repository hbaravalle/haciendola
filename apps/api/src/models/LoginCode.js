import { Model, DataTypes } from "sequelize";

// Pending login code per email (the account may not exist yet). Stored hashed.
class LoginCode extends Model {
  static initModel(sequelize) {
    LoginCode.init(
      {
        email: {
          type: DataTypes.STRING(254),
          primaryKey: true,
        },
        code_hash: {
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        attempts: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: "login_code",
        timestamps: true,
        underscored: true,
      }
    );
    return LoginCode;
  }
}

export default LoginCode;
