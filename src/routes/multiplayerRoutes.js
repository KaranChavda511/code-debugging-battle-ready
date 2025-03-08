// src/routes/multiplayerRoutes.js
import express from "express";
import { createMultiplayerRoom } from "../controllers/MultiplayerController.js";

const router = express.Router();

router.post("/create-room", createMultiplayerRoom);

export default router;
