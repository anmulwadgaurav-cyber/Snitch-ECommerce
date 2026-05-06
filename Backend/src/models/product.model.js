import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    price: {
      type: priceSchema,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    variants: [
      {
        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],
        stock: {
          type: Number,
          default: 0,
        },
        attributes: {
          type: Map,
          of: String,
        }, //ye attributes field hai jisme hum product ke different variants ke attributes store kar sakte hai. Jaise ki agar ek shirt ka product hai toh uske variants ke attributes me size, color, material etc. store kar sakte hai. Aur ye attributes field ek Map type ka hai jisme key string hogi (jaise size, color) aur value bhi string hogi (jaise M, L, Red, Blue). Isse hum easily product ke different variants ke attributes ko manage kar sakte hai.
        price: {
          type: priceSchema,
        },
      },
    ],
  },
  { timestamps: true },
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
