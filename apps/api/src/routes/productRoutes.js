const handleJWTError = require("../middlewares/jwtErrorHandler");
const productController = require("../controllers/productController");
const { expressjwt } = require("express-jwt");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  handleJWTError,
  productController.list
);
router.get(
  "/:product",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  handleJWTError,
  productController.find
);
router.post(
  "/",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  handleJWTError,
  productController.create
);
router.put(
  "/:product",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  handleJWTError,
  productController.update
);
router.delete(
  "/:product",
  expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
  handleJWTError,
  productController.destroy
);

module.exports = router;
