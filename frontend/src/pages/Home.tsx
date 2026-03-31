import { useState, useEffect } from "react";
import api from "../lib/api";
import { useInterview } from "../context/InterviewContext";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { setReport, history, fetchHistory } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);

      const res = await api.post("/interview", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReport(res.data.report);
      navigate("/interview");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* 🔷 Welcome Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to prepare for your next interview with AI?
          </p>
        </div>

        {/* 🔶 Main Form Card */}
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">
              Generate Interview Plan
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              {/* Left Side */}
              <div className="space-y-4">
                <div>
                  <Label>Upload Resume (PDF)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setResume(e.target.files ? e.target.files[0] : null)
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Self Description</Label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={5}
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-4">
                <div>
                  <Label>Job Description</Label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 text-lg"
                  disabled={loading}
                >
                  {loading ? "Generating Interview Plan..." : "Generate Interview"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 🔷 Previous Reports */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Previous Reports</h2>

          {history.length === 0 && (
            <p className="text-gray-500">No reports generated yet.</p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {history.map((item, index) => (
              <Card
                key={item._id || index}
                className="cursor-pointer hover:shadow-lg transition rounded-xl"
                onClick={() => {
                  setReport(item);
                  navigate("/interview");
                }}
              >
                <CardContent className="p-6 space-y-2">
                  <p className="text-lg font-semibold text-gray-700">
                    Match Score: {item.matchScore}%
                  </p>
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}