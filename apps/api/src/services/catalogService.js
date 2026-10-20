import { Product } from "../models/index.js";
import productListJSON from "../data/products.json" with { type: "json" };

// Seed rows with Shopify-style columns ("Compare Price") mapped to model fields.
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
    // Same as the model hook, which bulkCreate skips.
    enabled: Boolean(product.barcode),
  };
});

// One INSERT for the whole catalog (hooks would make it one per row).
async function seedCatalog(user, { transaction } = {}) {
  await Product.bulkCreate(
    SEED_PRODUCTS.map((product) => ({ ...product, user_id: user.id })),
    { transaction }
  );
  await user.update({ catalog_seeded_at: new Date() }, { transaction });
}

// Hard-deletes the user's products and seeds again.
async function resetCatalog(user, { transaction } = {}) {
  await Product.destroy({ where: { user_id: user.id }, force: true, transaction });
  await seedCatalog(user, { transaction });
}

export { seedCatalog, resetCatalog };
