import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/resume-screen": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => "/analyze-resume",
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
