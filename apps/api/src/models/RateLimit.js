import { Model, DataTypes } from "sequelize";

// Hits per key (limiter + IP) in the current window, shared by every instance.
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
