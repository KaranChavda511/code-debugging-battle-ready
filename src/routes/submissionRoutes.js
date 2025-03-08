// src/routes/submissionRoutes.js
import express from "express";
import { submitSolution, getSubmission } from "../controllers/submissionController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import logger from "../utils/logger.js";

const submissionRouteLogger = logger.child({ label: "routes/SubmissionRoutes.js" });

const router = express.Router();

// Log incoming requests
router.use((req, res, next) => {
  submissionRouteLogger.info(`Received ${req.method} request on ${req.url}`);
  next();
});

// Protected route to submit code solution
router.post("/submit", isLoggedIn, (req, res, next) => {
  submissionRouteLogger.info(`Submit solution route hit by user: ${req.user.id}`);
  next();
}, submitSolution);

// Optional: Get submission details (if implemented)
router.get("/:id", isLoggedIn, (req, res, next) => {
  submissionRouteLogger.info(`Get submission route hit for submission ID: ${req.params.id}`);
  next();
}, getSubmission);

export default router;
