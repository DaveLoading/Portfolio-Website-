/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind scans these files to find class names you used.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // "extend" means "add to defaults" instead of replacing them.
    // Put custom colors/fonts/spacing here later if needed.
    extend: {},
  },
  // Extra Tailwind plugins would go in this list.
  plugins: [],
};
