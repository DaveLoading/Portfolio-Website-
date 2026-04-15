// vite.config.ts is the configuration file for Vite, the build tool and dev server used by this project.
// It tells Vite how to transform, bundle, and serve the React/TypeScript source files.
import { defineConfig } from "vite";
// The official Vite plugin for React. It enables:
//  - JSX/TSX compilation so browsers can understand React components.
//  - Fast Refresh so the browser updates instantly as you edit code during development.
import react from "@vitejs/plugin-react";

// defineConfig wraps the config object so editors can provide type-checking and autocomplete.
export default defineConfig({
  // --- FIX: base path for GitHub Pages ---
  // GitHub Pages serves this site at a subpath because the repository name is "Portfolio-Website-".
  // The full URL looks like: https://daveloading.github.io/Portfolio-Website-/
  //
  // Without this setting Vite generates asset URLs starting from the root ("/"),
  // e.g. /assets/index.js — but GitHub Pages would look for that file at
  // https://daveloading.github.io/assets/index.js which doesn't exist (404).
  //
  // Setting base to "/Portfolio-Website-/" makes every asset URL include the
  // repo name, e.g. /Portfolio-Website-/assets/index.js, which resolves correctly.
  base: "/Portfolio-Website-/",

  // Register the React plugin so Vite handles .jsx/.tsx files.
  plugins: [react()],
});
