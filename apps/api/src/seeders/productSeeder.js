const { Product } = require("../models");
const productListJSON = require("./products.json");

async function productSeeder() {
  try {
    for (product of productListJSON) {
      const normalizedProduct = {};
      for (key in product) {
        const normalizedKey = key.replace(/\s+/g, "_").toLowerCase();
        normalizedProduct[normalizedKey] = product[key];
      }
      await Product.create({
        handle: normalizedProduct.handle,
        title: normalizedProduct.title,
        description: normalizedProduct.description,
        sku: normalizedProduct.sku,
        grams: normalizedProduct.grams,
        stock: normalizedProduct.stock,
        price: normalizedProduct.price,
        compare_price: normalizedProduct.compare_price,
        barcode: normalizedProduct.barcode || null,
      });
    }
    console.log("[Seeder] Products created");
  } catch (err) {
    console.log(err);
  }
}

module.exports = productSeeder;
