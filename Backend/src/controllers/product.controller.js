import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;
  // console.log(req.files[0]);

  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  const product = await productModel.create({
    title,
    description,
    price: { amount: priceAmount, currency: priceCurrency || "INR" },
    images,
    seller: seller._id,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
}

export async function getSellerProducts(req, res) {
  const seller = req.user;

  const products = await productModel.find({ seller: seller._id });

  res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products,
  });
}

export async function getProductDetailsById(req, res) {
  const { productId } = req.params;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      success: false,
    });
  }
}

export async function getSellerProductById(req, res) {
  const { productId } = req.params;
  const seller = req.user;

  try {
    const product = await productModel.findOne({
      _id: productId,
      seller: seller._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      success: false,
    });
  }
}

export async function getAllProducts(req, res) {
  const products = await productModel.find();

  if (products.length === 0) {
    return res.status(404).json({
      message: "No products found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "All products fetched successfully",
    success: true,
    products,
  });
}

export async function addProductVariant(req, res) {
  const productId = req.params.productId;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(400).json({
      message: "Product not found",
      success: false,
    });
  }

  const files = req.files;
  const images = [];
  if (files || files.length !== 0) {
    (
      await Promise.all(
        files.map(async (file) => {
          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return image;
        }),
      )
    ).map((image) => images.push(image));
  }

  const price = req.body.priceAmount;
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attributes || "{}");

  product.variants.push({
    images,
    price: {
      amount: price,
      currency: req.body.priceCurrency || product.price.currency,
    },
    stock,
    attributes,
  });

  await product.save();

  res.status(200).json({
    message: "Product variant added successfully!",
    success: true,
    product,
  });
}
