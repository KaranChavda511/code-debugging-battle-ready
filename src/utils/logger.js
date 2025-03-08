// src/utils/logger.js
import winston from "winston";
import path from "path";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Console logging
    new winston.transports.File({ filename: path.join("logs", "error.log"), level: "error" }), // Errors
    new winston.transports.File({ filename: path.join("logs", "combined.log") }) // All logs
  ],
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.File({ filename: path.join("logs", "exceptions.log") })
);

export default logger;
