import { GoogleGenAI } from "@google/genai";
import { interviewSchema } from "../schemas/interview.schema.js";

export const generateInterviewReport = async ({
  resumeText,
  jobDescription,
  selfDescription,
}) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an expert AI Interview Coach and Resume Writer.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

JSON FORMAT:
{
  "technicalQuestions": ["string"],
  "behavioralQuestions": ["string"],
  "skillGaps": ["string"],
  "preparationPlan": ["string"],
  "matchScore": number,

  "name": "string",
  "email": "string",
  "phone": "string",
  "summary": "string",
  "skills": ["string"],
  "projects": [
    { "title": "string", "description": "string" }
  ],
  "education": "string",

  "coverLetter": "string"
}

Use the data below to intelligently create everything.

Resume:
${resumeText}

Job Description:
${jobDescription}

Candidate Description:
${selfDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text =
      response.text ??
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No text returned from AI");

    // Remove markdown if Gemini adds it
    text = String(text).replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);

    // ✅ Zod validation (very important)
    const validated = interviewSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw new Error("AI response validation failed");
  }
};