import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#002070", dark: "#00358F", soft: "#E0F7FC" },
        secondary: "#172554",
        canvas: "#FFFFFF",
        surface: "#F4F8FC",
        light: "#E8F4FA",
        cyan: { DEFAULT: "#00D8F0", focus: "#00BFEA" },
        accent: "#8B24D6",
        ink: "#334155",
        muted: "#64748B",
        placeholder: "#94A3B8",
        line: "#DCE5EF",
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
