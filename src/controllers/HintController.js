// src/controllers/HintController.js
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";

export const getHint = async (req, res) => {
  try {
    const { challengeId, hintIndex } = req.params;
    const challenge = await Challenge.findById(challengeId);

    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    if (hintIndex >= challenge.hints.length)
      return res.status(400).json({ message: "No more hints available" });

    logger.info(`Hint provided for Challenge: ${challengeId}, Hint Index: ${hintIndex}`);
    res.json({ hint: challenge.hints[hintIndex] });
  } catch (error) {
    logger.error(`Error fetching hint: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
