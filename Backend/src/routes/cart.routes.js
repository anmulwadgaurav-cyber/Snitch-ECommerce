import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  validateAddToCart,
  validateIncrementCartItemQuantity,
  validateRemoveCartItemQuantity,
} from "../validators/cart.validator.js";
import {
  addToCartController,
  createOrderController,
  decrementCartItemQuantityController,
  getCartController,
  incrementCartItemQuantityController,
  removeCartItemController,
  verifyOrderController,
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

/*
@route PATCH /api/cart/quantity/increment/:productId/:variantId
@desc Increment item quantity in cart by one
@access private
@argument productId - ID of the product to update
@argument variantId - ID of the variant to update
*/

cartRouter.patch(
  "/quantity/increment/:productId/:variantId",
  authenticateUser,
  validateIncrementCartItemQuantity,
  incrementCartItemQuantityController,
);

/*
@route PATCH /api/cart/quantity/decrement/:productId/:variantId
@desc Increment item quantity in cart by one
@access private
@argument productId - ID of the product to update
@argument variantId - ID of the variant to update
*/

cartRouter.patch(
  "/quantity/decrement/:productId/:variantId",
  authenticateUser,
  validateIncrementCartItemQuantity,
  decrementCartItemQuantityController,
);

/*
@route DELETE /api/cart/delete/:productId/:variantId
@desc Remove an item from cart
@access private
@argument productId - ID of the product to delete
@argument variantId - ID of the variant to delete
*/

cartRouter.delete(
  "/delete/:productId/:variantId",
  authenticateUser,
  validateRemoveCartItemQuantity,
  removeCartItemController,
);

/*
@route POST /api/cart/payment/create/order
*/

cartRouter.post(
  "/payment/create/order",
  authenticateUser,
  createOrderController,
);

cartRouter.post(
  "/payment/verify/order",
  authenticateUser,
  verifyOrderController,
);

export default cartRouter;
