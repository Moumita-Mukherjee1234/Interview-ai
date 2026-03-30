const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("../routes/auth.routes");
const interviewRoutes = require("../routes/interview.routes");

const app = express();

/**
 * ✅ Allowed origins for CORS
 */
const allowedOrigins = [
  "http://localhost:5173",          // local frontend
  process.env.FRONTEND_URL         // deployed frontend (Vercel)
];

/**
 * ✅ CORS (must be first middleware)
 */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
 * ✅ Health/Test route
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