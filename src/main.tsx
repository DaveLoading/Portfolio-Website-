// main.tsx is the entry point of the React application.
// The browser loads this file first; it mounts the entire app into the HTML page.
import React from "react";

// ReactDOM is the bridge between React's virtual DOM and the real browser DOM.
// "react-dom/client" is the modern React 18+ API for mounting apps.
import ReactDOM from "react-dom/client";

// --- FIX: HashRouter instead of BrowserRouter for GitHub Pages ---
// BrowserRouter uses the HTML5 History API (e.g. /about, /projects) which requires
// the web server to respond to every URL with index.html.  GitHub Pages is a simple
// static file host — it does NOT do that.  If a visitor refreshes or navigates
// directly to any sub-page, GitHub Pages returns a 404 instead of the app, causing
// a blank or broken page.
//
// HashRouter puts the route AFTER a "#" in the URL (e.g. /#/about) so the browser
// never actually sends a new HTTP request to the server — the part after "#" is
// handled entirely by JavaScript.  This works perfectly on any static host,
// including GitHub Pages, with no server configuration required.
import { HashRouter } from "react-router-dom";

// App is the root React component that contains all the portfolio UI.
import App from "./App.tsx";

// index.css contains global styles (Tailwind base, resets, custom classes)
// that apply to every component in the app.
import "./index.css";

// getElementById("root") finds the <div id="root"> in index.html.
// createRoot tells React to take ownership of that div and manage its contents.
// The "!" tells TypeScript the element definitely exists (it's always in index.html).
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode is a development-only wrapper that activates extra warnings and
  // double-invokes certain functions to help catch bugs early.  It has no effect
  // in the production build.
  <React.StrictMode>
    {/*
      HashRouter wraps the whole app so any <Link> or navigation hook from
      react-router-dom works correctly on GitHub Pages (see import comment above).
    */}
    <HashRouter>
      {/* App renders the entire portfolio: hero, projects, paint tool, etc. */}
      <App />
    </HashRouter>
  </React.StrictMode>,
);
