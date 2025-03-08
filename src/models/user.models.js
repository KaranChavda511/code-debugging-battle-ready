// src/models/user.models.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0 }, // Track user score
    solvedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }], // Store solved challenges
    badges: [{ type: String }], // Achievements like "Debugging Master"
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
