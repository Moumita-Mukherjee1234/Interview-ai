import mongoose from "mongoose";

const { Schema, model } = mongoose;

const interviewReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    technicalQuestions: [
      {
        type: String,
      },
    ],

    behavioralQuestions: [
      {
        type: String,
      },
    ],

    skillGaps: [
      {
        type: String,
      },
    ],

    preparationPlan: [
      {
        type: String,
      },
    ],

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewReport = model("InterviewReport", interviewReportSchema);

export default InterviewReport;