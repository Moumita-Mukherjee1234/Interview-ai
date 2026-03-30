const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");
// existing routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// ✅ ADD THIS ROUTE
router.get("/get-me", authMiddleware, (req, res) => {
  res.json(req.user);   // ⚠️ EXACTLY THIS
});

module.exports = router;