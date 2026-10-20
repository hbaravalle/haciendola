import { Model, DataTypes } from "sequelize";

// The one-time code waiting to be typed for an email. Codes live apart from
// users because an email gets a code before its account exists: the account is
// created when the code is verified. Only a hash of the code is stored.
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
