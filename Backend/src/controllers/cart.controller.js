import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariantDao } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";


export const addToCartController = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
      Error,
    });
  }

  const stock = await stockOfVariantDao(productId, variantId);

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId,
    );

    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        "items.variant": variantId,
      },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }
  cart.items.push({
    product: productId,
    variant: variantId,
    quantity,
    price: product.price,
  });

  await cart.save();

  return res.status(200).json({
    message: "Product added to cart successfully",
    success: true,
  });
};

export const getCartController = async (req, res) => {
  const user = req.user;

  let cart = await getCartDetails(user._id);

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

export const incrementCartItemQuantityController = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(400).json({
      message: "Product or variant not found",
      success: false,
    });
  }
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const stock = await stockOfVariantDao(productId, variantId);

  const itemQuantityInCart =
    cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock, and you have already ${itemQuantityInCart} items`,
      success: false,
    });
  }

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    { $inc: { "items.$.quantity": 1 } },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart item quantity incremented successfully",
    success: true,
  });
};

export const decrementCartItemQuantityController = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(400).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const stock = await stockOfVariantDao(productId, variantId);

  const itemQuantityInCart =
    cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock, and you have already ${itemQuantityInCart} items`,
      success: false,
    });
  }

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    { $inc: { "items.$.quantity": -1 } },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart item quantity decremented successfully",
    success: true,
  });
};

export const removeCartItemController = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(400).json({
      message: "Product or variant not found",
      success: false,
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        items: {
          product: productId,
          variant: variantId,
        },
      },
    },
    { new: true },
  );

  return res.status(200).json({
    message: "Cart item removed successfully",
    success: true,
  });
};

export const createOrderController = async (req, res) => {
  const cart = (await getCartDetails(req.user._id))[0];

  if (!cart) {
    return res.status(400).json({
      message: "Cart is empty",
      success: false,
    });
  }

  const order = await createOrder({
    amount: cart.total,
    currency: cart.currency,
  });

  return res.status(200).json({
    message: "Order created successfully!",
    success: true,
    order: order,
  });
};
