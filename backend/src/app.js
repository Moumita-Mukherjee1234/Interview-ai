import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "../routes/auth.routes.js";
import interviewRoutes from "../routes/interview.routes.js";

const app = express();

/**
 * ✅ Allowed origins
 */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

/**
 * ✅ CORS (MUST BE FIRST)
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

/**
 * ✅ Core Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * ✅ Health check
 */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/**
 * ✅ Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

/**
 * ✅ Global Error Handler (VERY IMPORTANT)
 * Catches multer, pdf-parse, and any thrown errors
 */
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);

  // Multer file type / size errors
  if (err.message.includes("Only PDF files")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;