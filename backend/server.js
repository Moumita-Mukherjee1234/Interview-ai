require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

/**
 * Start server ONLY after DB connects
 */
const startServer = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // 2️⃣ Create HTTP server
    const server = http.createServer(app);

    // 3️⃣ Start listening
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // 4️⃣ Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();