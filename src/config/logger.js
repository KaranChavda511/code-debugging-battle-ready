import winston from "winston";
import "winston-daily-rotate-file";

// src/config/logger.js
// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Daily log rotation
const transport = new winston.transports.DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "7d", // Keep logs for 7 days
});

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [transport, new winston.transports.Console()],
});

export default logger;
