const { Model, DataTypes } = require("sequelize");

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        handle: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        sku: {
          type: DataTypes.BIGINT.UNSIGNED,
          unique: true,
          allowNull: false,
        },
        grams: {
          type: DataTypes.SMALLINT.UNSIGNED,
        },
        stock: {
          type: DataTypes.SMALLINT.UNSIGNED,
        },
        price: {
          type: DataTypes.SMALLINT.UNSIGNED,
          allowNull: false,
        },
        compare_price: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        barcode: {
          type: DataTypes.BIGINT.UNSIGNED,
          default: null,
          unique: true,
          validate: {
            isNumeric: true,
          },
        },
        enabled: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize,
        modelName: "product",
        timestamps: true,
        underscored: true,
        paranoid: true,
        hooks: {
          beforeSave: (product) => {
            if (product.barcode !== null) {
              product.enabled = true;
            } else {
              product.enabled = false;
            }
          },
        },
      }
    );
    return Product;
  }
}

module.exports = Product;
