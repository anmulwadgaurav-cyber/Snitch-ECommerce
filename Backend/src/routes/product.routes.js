import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProductById,
  getSellerProducts,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validators/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, //7MB
  },
});

const productRouter = express.Router();

/*
@route POST /api/products/
@desc Create a new product
@access Private (Seller only)
*/

productRouter.post(
  "/",
  authenticateSeller,
  upload.array("images", 7), //maximum ek product ki 7 images store kar sakte hai.
  createProductValidator,
  createProduct,
);

/*
@route GET /api/products/seller
@desc Get all products of the authenticated seller
@access private (Seller only) 
*/
productRouter.get("/seller", authenticateSeller, getSellerProducts);

/*
@route GET /api/products/detail/:productId
@desc Get product by id
@access Public
*/
productRouter.get("/detail/:productId", getProductById);

/*
@route GET /api/products/
@desc Get all products with pagination and filtering
@access Public
*/
productRouter.get("/", getAllProducts);

/*
@route  GET /api/seller/products/:productId
@desc   Get a single product by ID for the authenticated seller
@access Private (Seller only)
*/
productRouter.get(
  "/seller/detail/:productId",
  authenticateSeller,
  getSellerProductById,
);

export default productRouter;