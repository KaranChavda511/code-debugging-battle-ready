// src/controllers/codeController.js
import { executeUserCode } from "../utils/codeExecutor.js";
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";

const codeLogger = logger.child({ label: "controllers/CodeController.js" });

export const runCode = async (req, res) => {
  try {
    const { code, challengeId } = req.body;

    // Validate inputs
    if (!code) {
      codeLogger.warn("Code execution attempted with missing code.");
      return res.status(400).json({ message: "Code is required" });
    }

    if (!challengeId) {
      codeLogger.warn("Code execution attempted with missing challenge ID.");
      return res.status(400).json({ message: "Challenge ID is required" });
    }

    // Retrieve the challenge (to compare expected output)
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      codeLogger.warn(`Challenge not found: ${challengeId}`);
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Execute user code in a secure sandbox
    const result = await executeUserCode(code);

    if (result.success) {
      const isCorrect = result.output.trim() === challenge.expectedOutput.trim();
      codeLogger.info(`Code executed successfully for challenge ${challengeId}. Correct: ${isCorrect}`);

      return res.status(200).json({
        success: true,
        message: isCorrect ? "Correct Output ✅" : "Incorrect Output ❌",
        output: result.output,
        correct: isCorrect,
      });
    } else {
      codeLogger.warn(`Code execution failed for challenge ${challengeId}: ${result.error}`);
      return res.status(400).json({
        success: false,
        message: "Execution Error ❌",
        error: result.error,
      });
    }
  } catch (error) {
    codeLogger.error(`Unexpected error in runCode: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
