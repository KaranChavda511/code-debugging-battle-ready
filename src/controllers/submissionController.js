// src/controllers/submissionController.js
import { executeUserCode } from "../utils/codeExecutor.js";
import Challenge from "../models/challenge.models.js";
import User from "../models/user.models.js";
import logger from "../utils/logger.js";

const submissionLogger = logger.child({ label: "controllers/SubmissionController.js" });

export const submitSolution = async (req, res) => {
  try {
    const { challengeId, code } = req.body;
    const userId = req.user.id; // Set by authentication middleware

    // Retrieve challenge details
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      submissionLogger.warn(`Challenge not found: ${challengeId}`);
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Execute the user submitted code in a secure sandbox
    const result = await executeUserCode(code);

    if (result.success) {
      // Compare output (trim to avoid whitespace issues)
      if (result.output.trim() === challenge.expectedOutput.trim()) {
        // Update user score based on challenge difficulty
        const scoreIncrease = challenge.difficulty === "easy" ? 10 :
                              challenge.difficulty === "medium" ? 20 : 30;
        await User.findByIdAndUpdate(userId, { $inc: { score: scoreIncrease } });

        submissionLogger.info(`User ${userId} submitted correct solution for challenge ${challengeId}`);
        return res.status(200).json({
          success: true,
          message: "Correct solution! ✅",
          output: result.output,
        });
      } else {
        submissionLogger.info(`User ${userId} submitted incorrect solution for challenge ${challengeId}`);
        return res.status(400).json({
          success: false,
          message: "Incorrect solution. ❌",
          output: result.output,
        });
      }
    } else {
      submissionLogger.warn(`Execution error for user ${userId} on challenge ${challengeId}: ${result.error}`);
      return res.status(400).json({
        success: false,
        message: "Execution error.",
        error: result.error,
      });
    }
  } catch (error) {
    submissionLogger.error(`Submission error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Optional: Endpoint to fetch submission details (if needed)
export const getSubmission = async (req, res) => {
  res.status(200).json({ message: "Submission details feature under development" });
};
