// src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/code-debugging-battle");
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
