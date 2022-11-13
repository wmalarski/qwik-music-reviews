/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        activity: {
          10: "#ecfdf5",
          9: "#d1fae5",
          8: "#a7f3d0",
          7: "#6ee7b7",
          6: "#34d399",
          5: "#10b981",
          4: "#059669",
          3: "#047857",
          2: "#065f46",
          1: "#064e3b",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["black"],
  },
};
