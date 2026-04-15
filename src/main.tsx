// main.tsx is the app's entry point ("front door").
import React from "react";
// ReactDOM connects React to the real browser page.
import ReactDOM from "react-dom/client";
// HashRouter works on GitHub Pages where server-side routing is unavailable.
import { HashRouter } from "react-router-dom";
// App is the main UI component from App.tsx.
import App from "./App.tsx";
// Global CSS loads once for the whole app.
import "./index.css";

// Find the "root" div in index.html and mount React there.
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode helps catch common mistakes in development.
  <React.StrictMode>
    {/* HashRouter works on GitHub Pages without server-side routing. */}
    <HashRouter>
      {/* Render the actual app UI. */}
      <App />
    </HashRouter>
  </React.StrictMode>,
);
