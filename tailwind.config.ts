import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Ad gradients (defined in lib/ads.ts, applied via AdSlot)
    "from-violet-600",
    "via-primary",
    "to-orange-500",
    "from-slate-900",
    "via-slate-800",
    "to-primary/80",
    "from-blue-600",
    "to-cyan-500",
    "from-primary",
    "to-rose-600",
    "from-indigo-600",
    "to-purple-600",
    "from-foreground",
    "to-primary",
    "from-zinc-800",
    "to-zinc-900",
    // Category label colors (lib/topic-colors.ts)
    "text-category-react",
    "text-category-laravel",
    "text-category-uiux",
    "text-category-ecommerce",
    "text-category-apis",
    "text-category-saas",
    "text-category-startup",
    "text-category-frontend",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        foreground: "#0A0A0A",
        muted: "#64748B",
        border: "#E2E8F0",
        card: "#FFFFFF",
        surface: "#F1F5F9",
        "surface-dark": "#0F172A",
        primary: "#E63946",
        "primary-hover": "#DC2626",
        accent: "#6366F1",
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
        card: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
        "card-hover":
          "0 20px 40px -12px rgba(15,23,42,0.15), 0 8px 16px -8px rgba(15,23,42,0.08)",
        glow: "0 0 40px rgba(230, 57, 70, 0.15)",
      },
      maxWidth: {
        magazine: "1280px",
      },
      animation: {
        shimmer: "shimmer 2.5s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
