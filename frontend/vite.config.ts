import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Deployment-safe Vite config, no alias, no extra plugins
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});