import * as response from "../network/response.js";
import { Product } from "../models/index.js";
import {
  PAGE_SIZE,
  productSchema,
  productChangesSchema,
  comparePriceIssue,
} from "@haciendola/shared";

// Scope every query to the token's user.
function ownedBy(req) {
  return { user_id: req.auth.sub };
}

// Digits mean SKU: matching a handle against the numeric column fails.
function findBySkuOrHandle(req) {
  const product = req.params.product;
  const column = /^\d+$/.test(product) ? { sku: product } : { handle: product };
  return { ...column, ...ownedBy(req) };
}

// 400 with the first validation message.
function invalid(req, res, error) {
  return response.error(req, res, error.issues[0].message, 400);
}

// Duplicate handle, SKU or barcode in the catalog.
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

    // An empty catalog still answers page 1.
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
  // Empty optional fields become null, so missing barcodes don't collide.
  const parsed = productSchema.safeParse(req.body ?? {});
  if (!parsed.success) return invalid(req, res, parsed.error);

  try {
    await Product.create({ ...parsed.data, ...ownedBy(req) });
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
  // Only the fields sent are checked and saved.
  const parsed = productChangesSchema.safeParse(req.body ?? {});
  if (!parsed.success) return invalid(req, res, parsed.error);
  const changes = parsed.data;

  try {
    const product = await Product.findOne({
      where: findBySkuOrHandle(req),
    });
    if (!product) {
      return response.error(req, res, "Product not found", 404);
    }

    const saved = { ...product.get({ plain: true }), ...changes };
    const priceIssue = comparePriceIssue(saved);
    if (priceIssue) return response.error(req, res, priceIssue, 400);

    await product.update(changes);
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

export { list, find, create, update, destroy };
