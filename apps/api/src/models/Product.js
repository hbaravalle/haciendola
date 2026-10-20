import { Model, DataTypes } from "sequelize";

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        // Owner of this catalog copy.
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        handle: {
          type: DataTypes.STRING,
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
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        grams: {
          type: DataTypes.INTEGER,
        },
        stock: {
          type: DataTypes.INTEGER,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        compare_price: {
          type: DataTypes.INTEGER,
        },
        barcode: {
          type: DataTypes.BIGINT,
          default: null,
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
        // Unique per catalog, ignoring deleted products.
        indexes: ["handle", "sku", "barcode"].map((field) => ({
          unique: true,
          fields: ["user_id", field],
          where: { deleted_at: null },
        })),
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

export default Product;
