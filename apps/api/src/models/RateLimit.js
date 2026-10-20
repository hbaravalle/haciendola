import { Model, DataTypes } from "sequelize";

// Requests counted for one key (limiter + IP) in the current window. Kept in
// the database so every instance of the API shares the same counts: on
// Vercel each function instance has its own memory.
class RateLimit extends Model {
  static initModel(sequelize) {
    RateLimit.init(
      {
        key: {
          type: DataTypes.STRING(200),
          primaryKey: true,
        },
        hits: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        reset_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "rate_limit",
        timestamps: false,
        underscored: true,
      }
    );
    return RateLimit;
  }
}

export default RateLimit;
