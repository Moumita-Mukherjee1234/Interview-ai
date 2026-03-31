import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar w-full px-8 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="text-white text-2xl font-bold tracking-wide">
        InterviewAI
      </div>

      {/* Links */}
      <div className="flex items-center gap-8 text-white font-medium">
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/interview" className="hover:underline">
          Interview
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-[var(--indigo-deep)] px-4 py-2 rounded-md font-semibold hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="page-container mt-8">{children}</div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Layout>
                <Interview />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}