import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { InterviewProvider } from "./context/InterviewContext";
import { useAuthStore } from "./store/authStore";

function Root() {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  useEffect(() => {
    getCurrentUser(); // fetch logged-in user on app start
  }, [getCurrentUser]); // include dependency

  return (
    <InterviewProvider>
      <App />
    </InterviewProvider>
  );
}

// Create root element safely
const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);