const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const pdfParse = require("pdf-parse");

const { generateInterviewReport } = require("../services/ai.service");
const { resumeTemplate } = require("../src/templates/resumeTemplate");
const { generatePDF } = require("../services/pdf.service");

const InterviewReport = require("../models/InterviewReport.model");


// ✅ POST /api/interview
// Upload resume → Parse PDF → AI → Save report
router.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      const { jobDescription, selfDescription } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }

      // Convert PDF → text
      const pdfData = await pdfParse(req.file.buffer);
      const resumeText = pdfData.text;

      if (!resumeText || resumeText.trim().length < 50) {
        return res.status(400).json({
          message: "Unable to extract enough text from resume",
        });
      }

      // Call AI
      const aiReport = await generateInterviewReport({
        resumeText,
        jobDescription,
        selfDescription,
      });

      // Save to DB
      const savedReport = await InterviewReport.create({
        userId: req.user._id,
        technicalQuestions: aiReport.technicalQuestions,
        behavioralQuestions: aiReport.behavioralQuestions,
        skillGaps: aiReport.skillGaps,
        preparationPlan: aiReport.preparationPlan,
        matchScore: aiReport.matchScore,
      });

      return res.status(201).json({
        message: "Interview report generated successfully",
        report: savedReport,
      });
    } catch (error) {
      console.error("Interview Route Error:", error);
      return res.status(500).json({
        message: "Server error while generating interview report",
        error: error.message,
      });
    }
  }
);


// ✅ GET /api/interview
// Fetch previous reports of logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reports = await InterviewReport.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});


// ✅ POST /api/interview/resume
// AI Resume JSON → HTML → PDF
router.post("/resume", authMiddleware, async (req, res) => {
  try {
    const resumeData = req.body;

    const html = resumeTemplate(resumeData);
    const pdfBuffer = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=AI-Resume.pdf",
    });

    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to generate resume PDF",
      error: error.message,
    });
  }
});


module.exports = router;