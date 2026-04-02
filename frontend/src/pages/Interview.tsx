import { useInterview } from "../context/InterviewContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import api from "../lib/api";

export default function Interview() {
  const { report } = useInterview();

  const downloadFile = async (url: string, filename: string) => {
    try {
      const res = await api.post(url, report, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-plumLight">
        <Card className="w-[420px] rounded-2xl shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">No Report Yet</h2>
            <p className="text-muted-foreground">
              Generate an interview report from the home page to view it here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-plumLight p-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-plumDark">
            Interview Analysis Report
          </h1>
          <p className="text-gray-600 mt-2">
            AI-generated insights to help you prepare smarter.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            className="bg-plumDark hover:bg-plumMid text-white"
            onClick={() =>
              downloadFile("/interview/resume-pdf", "AI_Resume.pdf")
            }
          >
            Download AI Resume
          </Button>

          <Button
            className="bg-coral hover:opacity-90 text-white"
            onClick={() =>
              downloadFile("/interview/cover-letter-pdf", "Cover_Letter.pdf")
            }
          >
            Download Cover Letter
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Match Score */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-mint">
              {report.matchScore ?? 0}%
            </p>
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Skill Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {(report.skillGaps ?? []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Technical Questions */}
        <Card className="rounded-2xl shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle>Technical Questions to Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {(report.technicalQuestions ?? []).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Behavioral Questions */}
        <Card className="rounded-2xl shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle>Behavioral Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {(report.behavioralQuestions ?? []).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Preparation Roadmap */}
        <Card className="rounded-2xl shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle>Preparation Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              {(report.preparationPlan ?? []).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}