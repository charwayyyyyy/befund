import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f13",
        accent: "#3b82f6",
        accentSecondary: "#8b5cf6",
        textPrimary: "#f5f5f7"
      },
      borderRadius: {
        xl: "1rem"
      },
      boxShadow: {
        glow: "0 0 30px rgba(59, 130, 246, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
