import { body } from "express-validator";
import validationRequest from "../config/validationRequest.js";

export const createProductValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priceAmount").isNumeric().withMessage("Price amount must be a number"),
  body("priceCurrency")
    .optional()
    .isString()
    .withMessage("Price currency must be a string"),
  validationRequest,
];
