// src/controllers/MultiplayerController.js
import logger from "../utils/logger.js";
import Challenge from "../models/challenge.models.js";

// Create Multiplayer Room
export const createMultiplayerRoom = async (req, res) => {
  try {
    const { challengeId } = req.body;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    // Create a unique roomId based on challenge ID and timestamp
    const roomId = `room-${challengeId}-${Date.now()}`;

    logger.info(`Multiplayer room created: ${roomId} for Challenge: ${challengeId}`);
    res.status(200).json({ roomId });
  } catch (error) {
    logger.error(`Error creating multiplayer room: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

