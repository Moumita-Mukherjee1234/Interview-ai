const { GoogleGenAI } = require("@google/genai");
const { interviewSchema } = require("../schemas/interview.schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateInterviewReport = async ({
  resumeText,
  jobDescription,
  selfDescription,
}) => {
  try {
    const prompt = `
You are an AI Interview Coach.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

Format:
{
  "technicalQuestions": ["string"],
  "behavioralQuestions": ["string"],
  "skillGaps": ["string"],
  "preparationPlan": ["string"],
  "matchScore": number
}

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

    // ✅ SAFE TEXT EXTRACTION (VERY IMPORTANT)
    let text = "";

    if (response.text) {
      text = response.text;
    } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = response.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No text returned from AI");
    }

    // ✅ ENSURE STRING
    text = String(text);

    // ✅ CLEAN RESPONSE (FIXED)
    text = text.replace(/```json|```/g, "").trim();

    // ✅ PARSE JSON
    const parsed = JSON.parse(text);

    // ✅ VALIDATE WITH ZOD
    const validated = interviewSchema.parse(parsed);

    return validated;

  } catch (error) {
    console.error("AI Error:", error.message);
    throw new Error("AI response validation failed");
  }
};

module.exports = { generateInterviewReport };

