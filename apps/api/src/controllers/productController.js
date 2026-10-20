const response = require("../network/response");
const { Product } = require("../models");
const {
  PRODUCT_FIELDS,
  NUMERIC_PRODUCT_FIELDS,
  PAGE_SIZE,
} = require("@haciendola/shared");

// Every product query is limited to the catalog of the logged-in user, whose
// id is the token's subject.
function ownedBy(req) {
  return { user_id: req.auth.sub };
}

// Products are addressed by SKU (digits only) or by handle. Comparing a handle
// with the numeric SKU column makes Postgres reject the query, so pick the
// column from the shape of the value.
function findBySkuOrHandle(req) {
  const product = req.params.product;
  const column = /^\d+$/.test(product) ? { sku: product } : { handle: product };
  return { ...column, ...ownedBy(req) };
}

// Forms send numbers as strings and leave optional fields empty. An empty or
// missing number is stored as null, not 0, so two products without a barcode
// don't collide.
function readField(body, field) {
  const value = body[field];
  if (!NUMERIC_PRODUCT_FIELDS.includes(field)) return value;
  return value === undefined || value === null || value === ""
    ? null
    : Number(value);
}

// A handle, SKU or barcode already used in the same catalog.
function isDuplicate(err) {
  return err.name === "SequelizeUniqueConstraintError";
}

async function list(req, res) {
  try {
    const limit = PAGE_SIZE;
    const { page = 1 } = req.query;
    const pageNumber = Number(page);
    const offset = (pageNumber - 1) * limit;

    const count = await Product.count({ where: ownedBy(req) });
    const totalPages = Math.ceil(count / limit);

    // An empty catalog still answers page 1, with no products.
    const outOfRange =
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      (pageNumber > totalPages && pageNumber !== 1);
    if (outOfRange) {
      return response.error(req, res, "Products not found", 404);
    }

    const products = await Product.findAll({
      where: ownedBy(req),
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    const baseUrl = `${req.completeUrl}/products`;
    const nextPage =
      pageNumber < totalPages ? `${baseUrl}?page=${pageNumber + 1}` : null;
    const prevPage =
      pageNumber > 1 ? `${baseUrl}?page=${pageNumber - 1}` : null;

    return response.success(req, res, {
      count,
      page: pageNumber,
      totalPages: totalPages,
      next: nextPage,
      prev: prevPage,
      products,
    });
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function find(req, res) {
  try {
    const product = await Product.findOne({
      where: findBySkuOrHandle(req),
    });
    if (!product) {
      return response.error(req, res, "Product not found", 404);
    }
    return response.success(req, res, product);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function create(req, res) {
  try {
    await Product.create({
      ...Object.fromEntries(
        PRODUCT_FIELDS.map((field) => [field, readField(req.body, field)])
      ),
      ...ownedBy(req),
    });
    return response.success(req, res, "Product created", 201);
  } catch (err) {
    if (isDuplicate(err)) {
      return response.error(req, res, "A product with that handle, SKU or barcode already exists", 409);
    }
    console.log(err);
    return response.error(req, res);
  }
}

async function update(req, res) {
  try {
    const product = await Product.findOne({
      where: findBySkuOrHandle(req),
    });
    if (!product) {
      return response.error(req, res, "Product not found", 404);
    }

    // Only the fields the request sends are updated
    const updates = {};
    for (const field of PRODUCT_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = readField(req.body, field);
      }
    }

    await product.update(updates);
    return response.success(req, res, "Product updated", 200);
  } catch (err) {
    if (isDuplicate(err)) {
      return response.error(req, res, "A product with that handle, SKU or barcode already exists", 409);
    }
    console.log(err);
    return response.error(req, res);
  }
}

async function destroy(req, res) {
  try {
    const deleted = await Product.destroy({
      where: findBySkuOrHandle(req),
    });
    if (!deleted) {
      return response.error(req, res, "Product not found", 404);
    }
    return response.success(req, res, "Product deleted", 200);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

module.exports = { list, find, create, update, destroy };
