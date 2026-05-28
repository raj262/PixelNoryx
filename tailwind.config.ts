import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#111111",
        muted: "#666666",
        border: "#E5E5E5",
        card: "#FFFFFF",
        surface: "#F7F7F7",
        "surface-dark": "#1A1A1A",
        primary: "#E63946",
        "primary-hover": "#D62839",
        accent: "#111111",
        category: {
          react: "#2563EB",
          laravel: "#EF4444",
          uiux: "#8B5CF6",
          ecommerce: "#059669",
          apis: "#D97706",
          saas: "#0891B2",
          startup: "#DB2777",
          frontend: "#4F46E5",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.1)",
      },
      maxWidth: {
        magazine: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
