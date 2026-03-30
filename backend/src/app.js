const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("../routes/auth.routes");
const interviewRoutes = require("../routes/interview.routes");

const app = express();

/**
 * ✅ CORS (must be first)
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/**
 * ✅ Body parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ✅ Cookies
 */
app.use(cookieParser());

/**
 * ✅ Test route
 */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/**
 * ✅ Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

module.exports = app;