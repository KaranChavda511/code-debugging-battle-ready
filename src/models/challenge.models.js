// src/models/challenge.models.js
import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  buggyCode: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  hints: [{ type: String }], // 🆕 Array of hints
  timeLimit: { type: Number, default: 60 }, // Time in seconds
});

export default mongoose.model("Challenge", challengeSchema);
