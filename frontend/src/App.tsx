import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Interview from "./pages/Interview";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Zustand store
import { useAuthStore } from "./store/authStore";

function App() {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const loading = useAuthStore((state) => state.loading);

  // ✅ Runs once when app starts to check if user is logged in
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Optional loading screen while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-white bg-neutral-950">
        Checking authentication...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        {/* Default redirect for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;