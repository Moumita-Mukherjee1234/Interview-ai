import { useState, useEffect } from "react";
import {api} from "../lib/api";

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

  // ✅ Fetch previous reports when page loads
  useEffect(() => {
    fetchHistory();
  }, []);

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <div className="min-h-screen flex flex-col items-center bg-black text-white p-8 space-y-12">
      {/* 🔷 Generate Interview Form */}
      <Card className="w-[600px] p-6">
        <CardHeader>
          <CardTitle className="text-2xl">Generate Interview Plan</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                rows={4}
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Job Description</Label>
              <textarea
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Interview"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 🔶 Previous Reports Section */}
      <div className="w-[600px] space-y-4">
        <h2 className="text-3xl font-bold">Previous Reports</h2>

        {history.length === 0 && (
          <p className="text-neutral-400">No reports yet.</p>
        )}

        {history.map((item, index) => (
          <Card
            key={item._id || index}
            className="cursor-pointer hover:border-white border-neutral-800 bg-neutral-900"
            onClick={() => {
              setReport(item);
              navigate("/interview");
            }}
          >
            <CardContent className="p-4">
              <p className="text-sm text-neutral-400">
                Match Score: {item.matchScore}%
              </p>
              <p className="text-sm text-neutral-400">
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
  );
}