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
      <div className="min-h-screen flex items-center justify-center text-white">
        No report generated yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Interview Report</h1>
        <Button onClick={handleDownloadResume}>
          Download AI Resume
        </Button>
      </div>

      {/* Match Score */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl">Match Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-green-400">
            {report.matchScore ?? 0}%
          </p>
        </CardContent>
      </Card>

      {/* Technical Questions */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Technical Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            {(report.technicalQuestions ?? []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Behavioral Questions */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Behavioral Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            {(report.behavioralQuestions ?? []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Skill Gaps */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Skill Gaps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            {(report.skillGaps ?? []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Preparation Roadmap */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Preparation Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2">
            {(report.preparationPlan ?? []).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}