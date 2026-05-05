import { body } from "express-validator";
import validationRequest from "../config/validationRequest.js";

export const validateRegisterUser = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),
  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .matches(/^\d{10}$/) // Assuming a 10-digit contact number format
    .withMessage("Invalid contact number format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullname")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 5 })
    .withMessage("Full name must be at least 5 characters long"),
  body("isSeller").isBoolean().withMessage("isSeller must be a boolean value"),

  validationRequest,
];

export const validateLoginUser = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validationRequest,
];
