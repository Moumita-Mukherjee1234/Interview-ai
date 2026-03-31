import { createContext, useContext, useState } from "react";
import api from "../lib/api"

export interface InterviewReport {
  _id?: string;
  technicalQuestions: string[];
  behavioralQuestions: string[];
  skillGaps: string[];
  preparationPlan: string[];
  matchScore: number;
  createdAt?: string;
}

interface InterviewContextType {
  report: InterviewReport | null;
  setReport: (data: InterviewReport) => void;

  history: InterviewReport[];
  fetchHistory: () => Promise<void>;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

export function InterviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [history, setHistory] = useState<InterviewReport[]>([]);

  // ✅ Fetch previous interview reports from backend
  const fetchHistory = async () => {
    try {
      const res = await api.get("/interview");
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching interview history:", error);
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        report,
        setReport,
        history,
        fetchHistory,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used inside InterviewProvider");
  }
  return context;
}