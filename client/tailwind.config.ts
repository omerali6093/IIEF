import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#087F8C", dark: "#066772", soft: "#E6F4F5" },
        secondary: "#17324D",
        canvas: "#F8FAFB",
        ink: "#263746",
        muted: "#718096",
        line: "#E5E7EB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-urdu)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "var(--font-urdu)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "14px", field: "10px" },
      boxShadow: { card: "0 1px 2px rgba(23,50,77,.05), 0 8px 24px rgba(23,50,77,.06)" },
    },
  },
  plugins: [],
};
export default config;
