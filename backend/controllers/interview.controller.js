import InterviewReport from "../models/InterviewReport.model.js";
import { generateInterviewReport } from "../services/ai.service.js";
import { resumeTemplate } from "../src/templates/resumeTemplate.js";
import { coverLetterTemplate } from "../src/templates/coverLetterTemplate.js";
import { generatePDF } from "../services/pdf.service.js";

/**
 * ✅ STEP 1 — Generate AI Report + Save to DB
 */
export const createInterviewReport = async (req, res) => {
  try {
    const { resumeText, jobDescription, selfDescription } = req.body;

    const aiData = await generateInterviewReport({
      resumeText,
      jobDescription,
      selfDescription,
    });

    const report = await InterviewReport.create({
      userId: req.user.id,
      technicalQuestions: aiData.technicalQuestions,
      behavioralQuestions: aiData.behavioralQuestions,
      skillGaps: aiData.skillGaps,
      preparationPlan: aiData.preparationPlan,
      matchScore: aiData.matchScore,
    });

    res.status(201).json({
      reportId: report._id,
      aiData, // contains optimizedResume & coverLetter
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ STEP 2 — Get History
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
 * ✅ STEP 3 — Resume PDF Download
 */
export const downloadResumePDF = async (req, res) => {
  try {
    const { resumeContent, name } = req.body;

    if (!resumeContent) {
      return res.status(400).json({ message: "resumeContent is required" });
    }

    // ✅ Convert resume text into styled HTML
    const html = resumeTemplate({ resumeContent, name });

    // ✅ Convert HTML to PDF buffer
    const pdfBuffer = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Resume.pdf",
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ STEP 4 — Cover Letter PDF Download
 */
export const downloadCoverLetterPDF = async (req, res) => {
  try {
    const { coverLetter, name } = req.body;

    if (!coverLetter) {
      return res.status(400).json({ message: "coverLetter is required" });
    }

    const html = coverLetterTemplate({ coverLetter, name });
    const pdfBuffer = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=Cover-Letter.pdf",
    });

    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};