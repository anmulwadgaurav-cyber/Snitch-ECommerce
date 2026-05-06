import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        enum: ["INR", "USD", "GBP", "JPY"],
        default: "INR",
      },
    },
  },
  {
    _id: false,
    _v: false,
  },
);

export default priceSchema;
