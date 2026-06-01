import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "chinese-red": {
          DEFAULT: "#C41E3A",
          dark: "#9B1830",
          hover: "#A8192F",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F5E6C8",
          pale: "#FEF9E7",
          dark: "#B8960C",
        },
        cream: "#FFF8F0",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
