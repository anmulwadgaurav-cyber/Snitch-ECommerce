import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validators/cart.validator.js";
import {
  addToCartController,
  getCartController,
} from "../controllers/cart.controller.js";
const cartRouter = express.Router();

/*
@route POST /api/cart/add/:productId/:variantId
@desc add item to cart
@access private
@argument productId - ID of the product to add
@argument variantId - ID of the variant to add
@argument quantity - Quantitiy of the item to add (optional, defualt: 1) 
*/

cartRouter.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addToCartController,
);

/*
@route GET /api/cart
@desc Get user's cart
@access private
*/

cartRouter.get("/", authenticateUser, getCartController);

export default cartRouter;
