// src/server.js
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger from "./utils/logger.js";
import morganMiddleware from "./middlewares/loggerMiddleware.js";
import limiter from "./middlewares/rateLimiter.js";

// Import Routes
import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import codeExecutionRoutes from "./routes/codeExecutionRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import multiplayerRoutes from "./routes/multiplayerRoutes.js";
import hintRoutes from "./routes/hintRoutes.js";
import powerupRoutes from "./routes/powerupRoutes.js";
import codeRoutes from "./routes/codeRoutes.js"; //  Isko bhi rakha, par `/api/code` duplicate fix hoga
// import solutionRoutes from "./routes/solutionRoutes.js";


// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);

// // Configure CORS with exact origin match
// app.use(cors({
//   origin: 'http://localhost:5173' // No trailing slash
// }));

// // Or for multiple frontend origins:
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://your-production-domain.com']
// }));

// cors configuration
const corsOptions = {
  origin: ["http://localhost:5173"], // Frontend ka exact origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};
app.use(cors(corsOptions));  // ✅ Ye bas ek jagah rakho

const io = new Server(server, {
  cors: corsOptions,
});


// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(morganMiddleware); // Morgan Middleware
app.use(limiter);

// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/code-execution", codeExecutionRoutes); //  Duplicate hata diya
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/multiplayer", multiplayerRoutes);
app.use("/api/hints", hintRoutes);
app.use("/api/powerups", powerupRoutes);
app.use("/api/code", codeRoutes);
// app.use("/api/solutions", solutionRoutes);


// Home Route
app.get("/", (req, res) => {
  res.send("Code Debugging Platform API is running...");
});


// 🔥 Socket.IO Connection Handling
io.on("connection", (socket) => {
  logger.info(`New user connected: ${socket.id}`);

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    socket.to(roomId).emit("userJoined", { message: `${username} joined the game!` });
    logger.info(`${username} joined room: ${roomId}`);
  });

  socket.on("submitSolution", ({ roomId, username, isCorrect }) => {
    if (isCorrect) {
      io.to(roomId).emit("challengeCompleted", { winner: username });
      logger.info(`${username} solved the challenge first in Room: ${roomId}`);
    }
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
