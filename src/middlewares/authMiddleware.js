// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const isLoggedIn = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    logger.warn("Unauthorized access attempt");
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const tokenParts = token?.split(" ");
if (!tokenParts || tokenParts.length !== 2) {
    return res.status(401).json({ message: "Invalid Token Format" });
}

    req.user = verified; // Attach user data to request
    next();
  } catch (error) {
    logger.error("Invalid token", { error: error.message });
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default isLoggedIn;
