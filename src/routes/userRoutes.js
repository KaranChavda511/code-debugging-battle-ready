// src/routes/userRoutes.js
import express from "express";
import { signup, login } from "../controllers/userController.js";
import logger from "../utils/logger.js";

const userRoutes = express.Router();

// Middleware for logging requests
userRoutes.use((req, res, next) => {
  logger.info(`Received ${req.method} request on ${req.url}`);
  next();
});

// Signup Route
userRoutes.post("/signup", signup);

// Login Route
userRoutes.post("/login", login);

export default userRoutes;
