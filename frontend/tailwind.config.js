/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14151B",
          soft: "#1D1F28",
          softer: "#262933",
        },
        paper: {
          DEFAULT: "#F4F5F7",
          dim: "#E8E9ED",
        },
        settle: {
          DEFAULT: "#00B37E",
          dim: "#00875F",
          bg: "#E4F7EF",
        },
        owe: {
          DEFAULT: "#E8543E",
          dim: "#C7442F",
          bg: "#FCEAE7",
        },
        gold: {
          DEFAULT: "#E8A93E",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,21,27,0.04), 0 8px 24px -8px rgba(20,21,27,0.10)",
        pop: "0 4px 12px -2px rgba(0,179,126,0.35)",
      },
    },
  },
  plugins: [],
};
