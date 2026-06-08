import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18211f",
        moss: "#47624f",
        clay: "#b66c4d",
        cream: "#f6f1e8",
        oat: "#e6d7bf",
        espresso: "#3a2921",
        mint: "#d9ece3",
      },
      boxShadow: {
        soft: "0 12px 36px rgba(24, 33, 31, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
