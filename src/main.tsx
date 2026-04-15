// main.tsx is the app's entry point ("front door").
import React from "react";
// ReactDOM connects React to the real browser page.
import ReactDOM from "react-dom/client";
// BrowserRouter enables URL-based navigation.
import { BrowserRouter } from "react-router-dom";
// App is the main UI component from App.tsx.
import App from "./App.tsx";
// Global CSS loads once for the whole app.
import "./index.css";

// Find the "root" div in index.html and mount React there.
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode helps catch common mistakes in development.
  <React.StrictMode>
    {/* BrowserRouter wraps the whole app so routes work everywhere. */}
    <BrowserRouter>
      {/* Render the actual app UI. */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
