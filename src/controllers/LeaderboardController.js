// src/controllers/LeaderboardController.js
import User from "../models/user.models.js";
import logger from "../utils/logger.js";

// Get Top 10 Users by Score
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find().sort({ score: -1 }).limit(10).select("username score badges");

    logger.info("Leaderboard fetched successfully");
    res.status(200).json(topUsers);
  } catch (error) {
    logger.error(`Leaderboard Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
