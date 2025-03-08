// src/controllers/challengeController.js
import Challenge from "../models/challenge.models.js";
import logger from "../utils/logger.js";

// Create a new challenge
export const createChallenge = async (req, res) => {
  try {
    const { title, description, buggyCode, expectedOutput, difficulty, timeLimit } = req.body;

    const newChallenge = new Challenge({
      title,
      description,
      buggyCode,
      expectedOutput,
      difficulty,
      timeLimit,
    });

    await newChallenge.save();
    logger.info(`New challenge created: ${title}`);
    res.status(201).json({ message: "Challenge created successfully", challenge: newChallenge });
  } catch (error) {
    logger.error(`Error creating challenge: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all challenges
export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.status(200).json(challenges);
  } catch (error) {
    logger.error(`Error fetching challenges: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get challenge by ID
export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.status(200).json(challenge);
  } catch (error) {
    logger.error(`Error fetching challenge: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update challenge
export const updateChallenge = async (req, res) => {
  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedChallenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    logger.info(`Challenge updated: ${updatedChallenge.title}`);
    res.status(200).json(updatedChallenge);
  } catch (error) {
    logger.error(`Error updating challenge: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete challenge
export const deleteChallenge = async (req, res) => {
  try {
    const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!deletedChallenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }
    logger.info(`Challenge deleted: ${deletedChallenge.title}`);
    res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting challenge: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
