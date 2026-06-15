import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#667085",
        line: "#E5E7EB",
        mint: "#14B8A6",
        coral: "#F97316",
        lemon: "#FACC15"
      },
      boxShadow: {
        soft: "0 14px 35px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
