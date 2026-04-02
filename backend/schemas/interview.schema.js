import { z } from "zod";

export const interviewSchema = z.object({
  technicalQuestions: z.array(z.string()),
  behavioralQuestions: z.array(z.string()),
  skillGaps: z.array(z.string()),
  preparationPlan: z.array(z.string()),
  matchScore: z.number(),

  // ✅ Resume data
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  education: z.string(),

  // ✅ Cover letter
  coverLetter: z.string(),
});