import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
});
