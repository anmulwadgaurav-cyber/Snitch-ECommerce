import { body, param } from "express-validator";
import validationRequest from "../config/validationRequest.js";

export const validateAddToCart = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("variantId").isMongoId().withMessage("Invalid product ID"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be atleast 1"),
  validationRequest,
];

export const validateIncrementCartItemQuantity = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("variantId").isMongoId().withMessage("Invalid product ID"),
  validationRequest,
];

export const validateRemoveCartItemQuantity = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("variantId").isMongoId().withMessage("Invalid product ID"),
  validationRequest,
];
