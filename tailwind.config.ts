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
          DEFAULT: "#B668BD",
          dark: "#C65C5C",
          hover: "#9B58A1",
        },
        gold: {
          DEFAULT: "#CD8136",
          light: "#F8ECE1",
          pale: "#FCF9F5",
          dark: "#A4672B",
        },
        cream: "#FCFCFC",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "var(--font-noto-serif-sc)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "var(--font-noto-serif-sc)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
