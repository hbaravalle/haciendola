const response = require("../network/response");
const { Op } = require("sequelize");
const { Product } = require("../models");
const path = require("path");

async function list(req, res) {
  try {
    const limit = 10;
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
    const newProduct = await Product.create({
      handle: req.body.handle,
      title: req.body.title,
      description: req.body.description,
      sku: Number(req.body.sku),
      grams: Number(req.body.grams),
      stock: Number(req.body.stock),
      price: Number(req.body.price),
      compare_price: Number(req.body.compare_price),
      barcode: Number(req.body.barcode),
    });
    return response.success(req, res, "Product created", 201);
  } catch (err) {
    console.log(err);
    return response.error(req, res);
  }
}

async function update(req, res) {
  try {
    const {
      handle,
      title,
      description,
      sku,
      grams,
      stock,
      price,
      compare_price,
      barcode,
    } = req.body;
    const product = await Product.findOne({
      where: {
        [Op.or]: [{ sku: req.params.product }, { handle: req.params.product }],
      },
    });
    if (!product) {
      return response.error(req, res, "Product not found", 404);
    }

    const fields = {
      handle,
      title,
      description,
      sku,
      grams,
      stock,
      price,
      compare_price,
      barcode,
    };
    const updates = {};

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
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
