import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting MongoDD", error);
    throw error;
  }
};
