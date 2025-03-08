// src/middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

// Limit requests: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, 
  legacyHeaders: false, 
});

export default limiter;
