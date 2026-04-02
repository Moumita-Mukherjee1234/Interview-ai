// routes/auth.routes.js
import express from "express";
const router = express.Router();

import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

// existing routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ✅ ADD THIS ROUTE
router.get("/get-me", authMiddleware, (req, res) => {
  res.json(req.user);   // ⚠️ EXACTLY THIS
});

export default router;