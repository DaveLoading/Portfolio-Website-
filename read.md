# David Shamas Portfolio - Simple Code Guide

This file explains the project in simple language.
Think of this website like a game level:
- Vite is the game engine.
- React is the way we build screens.
- Tailwind is the paint and style system.
- App.tsx is the main scene with all the UI pieces.

## 1) What this project is

This is a React + TypeScript portfolio website.
It has:
- Animated sections
- Project cards
- Skills and capabilities panels
- Contact links

## 2) File map (what each file does)

Note about comments:
- Most files now include simple inline comments.
- JSON files (like package.json and tsconfig files) do not allow real comments, so their explanations are written here in read.md.

- package.json
  Tells Node what this project needs and which commands to run.

- index.html
  The single web page shell. It has one root div where React draws the site.

- src/main.tsx
  The app entry point. It loads the App component into the root div.

- src/App.tsx
  The big main UI component. Most of your website layout and content lives here.

- src/index.css
  Global styles + Tailwind directives.

- tailwind.config.js
  Tells Tailwind where to look for class names.

- postcss.config.js
  Connects Tailwind and autoprefixer to the CSS build process.

- vite.config.ts
  Vite setup (with React plugin).

- tsconfig.json and tsconfig.node.json
  TypeScript rules for checking your code.

- david_shamas_portfolio_site.jsx
  A tiny bridge file that re-exports from src/App.tsx.

## 3) How App.tsx is organized

App.tsx is split into small building blocks.
Each function is like a LEGO piece.
Then the main function puts all pieces together.

Main piece types:
- Reusable UI pieces:
  GithubMark, PanelsIcon, BootLine, DesktopIcon, WindowFrame, SectionChip, SkillBar

- Content panels:
  ProjectPanel, SystemsMap, SignalGrid, CapabilityPanel, ShowcaseFrame

- Main page:
  DavidShamasPortfolio

Inside DavidShamasPortfolio:
- State:
  activeProject and filter remember what the user picked.

- Data arrays:
  projects, filters, skillGroups, methods, capabilities
  These are the content and labels shown on the site.

- Filtering logic:
  useMemo builds filteredProjects so only matching category cards show.

- Render sections:
  Boot area, desktop hero, methods, showcase, skills, capabilities, learning, philosophy, contact

## 4) Why there were bugs before

The original file used TypeScript-style types in a .jsx file.
Example: type Project = { ... }
That only works in TypeScript files like .ts or .tsx.

So the fix was:
- Create a proper Vite React TypeScript app structure
- Move the real app to src/App.tsx
- Keep the old root file as a small bridge

## 5) How to run the site

From the project folder:

1. Install packages
npm install

2. Start dev server
npm run dev -- --host 127.0.0.1

3. Open in browser
http://127.0.0.1:5173/

Important:
If you close the terminal running the dev server, the site will stop and the browser will say connection refused.

## 6) How to build for production

npm run build

This creates the dist folder with optimized files.

## 7) Easy next improvements

- Split App.tsx into smaller files (components folder)
- Move data arrays into separate data files
- Add a simple README screenshot and project notes
- Add tests for key UI sections
