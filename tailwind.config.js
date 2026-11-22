/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // scans all JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {
      fontFamily: {
        khmer: [
          "'Noto Sans Khmer'",
          "'Noto Serif Khmer'",
          "system-ui",
          "-apple-system",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
