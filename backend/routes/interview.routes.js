import express from "express";
import pdfParse from "pdf-parse";

import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  createInterviewReport,
  getReports,
  downloadResumePDF,
  downloadCoverLetterPDF,
} from "../controllers/interview.controller.js";

const router = express.Router();

/*
POST /api/interview/generate
Upload resume → extract text → controller handles AI + DB
*/
router.post(
  "/generate",
  authMiddleware,
  upload.single("resume"), // multer handles file
  async (req, res, next) => {
    try {
      const { jobDescription, selfDescription } = req.body;

      // ❗ Important safety check
      if (!req.file) {
        return res.status(400).json({ message: "No resume uploaded" });
      }

      // ✅ Parse PDF directly from memory (NO fs, NO path)
      const pdfData = await pdfParse(req.file.buffer);
      const resumeText = pdfData.text;

      if (!resumeText || resumeText.trim().length < 50) {
        return res
          .status(400)
          .json({ message: "Unable to extract text from resume" });
      }

      // Pass processed data to controller
      req.body = {
        resumeText,
        jobDescription,
        selfDescription,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
  createInterviewReport
);

/*
GET /api/interview/history
*/
router.get("/history", authMiddleware, getReports);

/*
POST /api/interview/resume-pdf
*/
router.post("/resume-pdf", authMiddleware, downloadResumePDF);

/*
POST /api/interview/cover-letter-pdf
*/
router.post("/cover-letter-pdf", authMiddleware, downloadCoverLetterPDF);

export default router;