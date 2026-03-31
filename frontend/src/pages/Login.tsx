import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE BRAND PANEL */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden bg-[var(--indigo-deep)] text-white">
        {/* Animated blobs */}
        <div className="absolute w-72 h-72 bg-[var(--teal)] opacity-30 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-72 h-72 bg-[var(--coral-red)] opacity-30 rounded-full blur-3xl animate-pulse bottom-10 right-10" />

        <div className="z-10 text-center px-10">
          <h1 className="text-5xl font-bold mb-6 tracking-wide">
            InterviewAI
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Prepare smarter. <br />
            Analyze your resume. <br />
            Crack your next interview with AI.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-[var(--white-soft)] px-6">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 shadow-2xl border border-gray-200">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--indigo-deep)]">
                Welcome Back 👋
              </h2>
              <p className="text-[var(--text-soft)] mt-2">
                Login to continue your interview preparation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 focus:ring-2 focus:ring-[var(--teal)]"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-[var(--indigo-deep)] hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-sm text-center text-[var(--text-soft)] mt-4">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[var(--coral-red)] font-semibold hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}