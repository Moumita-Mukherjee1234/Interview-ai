import { useInterview } from "../context/InterviewContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import api from "../lib/api";
import { Button } from "../components/ui/button";

export default function Interview() {
  const { report } = useInterview();

  const handleDownloadResume = async () => {
    if (!report) return;

    try {
      const res = await api.post(
        "/interview/resume",
        report,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "AI_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[420px] shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">No Report Yet</h2>
            <p className="text-gray-500">
              Generate an interview report from the dashboard to view it here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Interview Analysis Report
          </h1>
          <p className="text-gray-500 mt-2">
            AI-generated insights to help you prepare smarter.
          </p>
        </div>
        <Button onClick={handleDownloadResume}>
          Download AI Resume
        </Button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Match Score */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-indigo-600">
              {report.matchScore ?? 0}%
            </p>
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        <Card className="shadow-md rounded-2xl">
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
        <Card className="shadow-md rounded-2xl md:col-span-2">
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
        <Card className="shadow-md rounded-2xl md:col-span-2">
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
        <Card className="shadow-md rounded-2xl md:col-span-2">
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