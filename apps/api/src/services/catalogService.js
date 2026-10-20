import { Product } from "../models/index.js";
import productListJSON from "../seeders/products.json" with { type: "json" };

// The challenge's catalog, with its Shopify-style column names ("Compare
// Price") turned into the model's fields (compare_price).
const SEED_PRODUCTS = productListJSON.map((row) => {
  const product = {};
  for (const key in row) {
    product[key.replace(/\s+/g, "_").toLowerCase()] = row[key];
  }
  return {
    handle: product.handle,
    title: product.title,
    description: product.description,
    sku: product.sku,
    grams: product.grams,
    stock: product.stock,
    price: product.price,
    compare_price: product.compare_price,
    barcode: product.barcode || null,
    // Same rule as the model's beforeSave hook, which a bulk insert skips.
    enabled: Boolean(product.barcode),
  };
});

// Gives the user their own copy of the seed catalog, in a single INSERT.
// (Running the hooks per row would turn it into one INSERT per product.)
async function seedCatalog(user, { transaction } = {}) {
  await Product.bulkCreate(
    SEED_PRODUCTS.map((product) => ({ ...product, user_id: user.id })),
    { transaction }
  );
  await user.update({ catalog_seeded_at: new Date() }, { transaction });
}

// Throws away the user's products, deleted ones included, and seeds again.
async function resetCatalog(user, { transaction } = {}) {
  await Product.destroy({ where: { user_id: user.id }, force: true, transaction });
  await seedCatalog(user, { transaction });
}

export { seedCatalog, resetCatalog };
