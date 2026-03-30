import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthStore();

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}