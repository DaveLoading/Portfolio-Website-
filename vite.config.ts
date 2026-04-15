// vite.config.ts controls how Vite builds/runs this project.
import { defineConfig } from "vite";
// React plugin adds JSX/TSX support and fast refresh.
import react from "@vitejs/plugin-react";

// Export one config object for Vite to read.
export default defineConfig({
  // The React plugin lets Vite understand JSX/TSX files.
  plugins: [react()],
});
