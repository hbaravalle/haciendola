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
        // Each user has their own copy of the catalog.
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
        // Handles, SKUs and barcodes are unique within a user's catalog, so
        // every catalog can hold the same products. Deleted products don't
        // count, so a deleted product can be created again.
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
