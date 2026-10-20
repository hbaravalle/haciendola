import handleJWTError from "../middlewares/jwtErrorHandler.js";
import * as productController from "../controllers/productController.js";
import { expressjwt } from "express-jwt";
import express from "express";
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

export default router;
