import InterviewReport from "../models/InterviewReport.model.js";
const { resumeTemplate } = require("../src/templates/resumeTemplate");
const { generatePDF } = require("../services/pdf.service");
/**
 * ✅ Save Interview Report (AI output → DB)
 */
export const saveInterviewReport = async (req, res) => {
  try {
    const {
      technicalQuestions,
      behavioralQuestions,
      skillGaps,
      preparationPlan,
      matchScore,
    } = req.body;

    const report = await InterviewReport.create({
      userId: req.user.id,
      technicalQuestions,
      behavioralQuestions,
      skillGaps,
      preparationPlan,
      matchScore,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Get All Reports of Logged-in User (History)
 */
export const getReports = async (req, res) => {
  try {
    const reports = await InterviewReport.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Generate Resume PDF (AI resume → HTML → PDF)
 */
export const generateResume = async (req, res) => {
  try {
    const resumeData = req.body; // data coming from AI

    const html = resumeTemplate(resumeData);
    const pdfBuffer = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=AI-Resume.pdf",
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};