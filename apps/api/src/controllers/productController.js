const response = require("../network/response");
const { Op } = require("sequelize");
const { Product } = require("../models");
const {
  PRODUCT_FIELDS,
  NUMERIC_PRODUCT_FIELDS,
  PAGE_SIZE,
} = require("@haciendola/shared");

async function list(req, res) {
  try {
    const limit = PAGE_SIZE;
    const { page = 1 } = req.query;
    const pageNumber = Number(page);
    const offset = (pageNumber - 1) * limit;

    const count = await Product.count();
    const totalPages = Math.ceil(count / limit);

    if (pageNumber > totalPages || pageNumber === 0) {
      return response.error(req, res, "Products not found", 404);
    }

    const products = await Product.findAll({
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    const baseUrl = `${req.completeUrl}/products`;
    const nextPage =
      page < totalPages ? `${baseUrl}?page=${pageNumber + 1}` : null;
    const prevPage = page > 1 ? `${baseUrl}?page=${pageNumber - 1}` : null;

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
      where: {
        [Op.or]: [{ sku: req.params.product }, { handle: req.params.product }],
      },
    });
    return response.success(req, res, product);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function create(req, res) {
  try {
    console.log(req.body);
    const newProduct = await Product.create(
      Object.fromEntries(
        PRODUCT_FIELDS.map((field) => [
          field,
          NUMERIC_PRODUCT_FIELDS.includes(field)
            ? Number(req.body[field])
            : req.body[field],
        ])
      )
    );
    return response.success(req, res, "Product created", 201);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function update(req, res) {
  try {
    const product = await Product.findOne({
      where: {
        [Op.or]: [{ sku: req.params.product }, { handle: req.params.product }],
      },
    });
    if (!product) {
      return response.error(req, res, "Product not found", 404);
    }

    // Only the fields the request sends are updated
    const updates = {};
    for (const field of PRODUCT_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    await product.update(updates);
    return response.success(req, res, "Product updated", 200);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function destroy(req, res) {
  try {
    const product = await Product.destroy({
      where: {
        [Op.or]: [{ sku: req.params.product }, { handle: req.params.product }],
      },
    });
    return response.success(req, res, "Product deleted", 200);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

module.exports = { list, find, create, update, destroy };
