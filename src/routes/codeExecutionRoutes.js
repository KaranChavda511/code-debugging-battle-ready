// src/routes/codeExecutionRoutes.js
import { Server } from "socket.io";
import { executeUserCode } from "../utils/codeExecutor.js";
import logger from "../utils/logger.js";

const executionLogger = logger.child({ label: "routes/CodeExecutionRoutes.js" });

const setupCodeExecutionSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    executionLogger.info(`New client connected: ${socket.id}`);

    socket.on("submitCode", async ({ code, challengeId }) => {
      executionLogger.info(`Received code submission from ${socket.id} for challenge ${challengeId}`);

      if (!code) {
        socket.emit("executionResult", { success: false, message: "Code is required" });
        return;
      }

      const result = await executeUserCode(code);
      socket.emit("executionResult", result);
    });

    socket.on("disconnect", () => {
      executionLogger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default setupCodeExecutionSocket;
