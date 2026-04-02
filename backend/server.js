import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./src/app.js";
import connectDB from "./config/database.js";

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    // ✅ Connect DB first
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // ✅ Create HTTP server
    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();

/*
========================================
Global Error Handlers (VERY IMPORTANT)
========================================
*/

// Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  if (server) {
    server.close(() => process.exit(1));
  }
});

// Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// Graceful shutdown (Ctrl + C)
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  }
});