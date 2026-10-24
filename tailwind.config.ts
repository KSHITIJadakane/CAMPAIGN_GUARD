import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#fefffc",
        paper: "#ffffff",
        linen: "#f9faf7",
        ink: "#171717",
        graphite: "#2c2c2c",
        charcoal: "#444141",
        ash: "#646464",
        fog: "#b4b8b4",
        mist: "#dee2de",
        twilight: "#282834",
        dusk: "#1f1f29",
        "signal-blue": "#41a1cf",
        cerulean: "#0081c0",
        // Editorial status accents
        status: {
          pass: "#059669",
          "pass-bg": "#ecfdf5",
          "pass-border": "#a7f3d0",
          warn: "#d97706",
          "warn-bg": "#fffbeb",
          "warn-border": "#fde68a",
          error: "#e11d48",
          "error-bg": "#fff1f2",
          "error-border": "#fecdd3",
          info: "#0284c7",
          "info-bg": "#f0f9ff",
          "info-border": "#bae6fd",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        pill: "50px",
        large: "24px",
      },
      boxShadow: {
        editorial: "0 1px 1px rgba(0,0,0,0.05), 0 4px 6px -1px rgba(0,0,0,0.03)",
        "subtle-card": "0 1px 2px rgba(0, 0, 0, 0.04)",
        "nav-pill": "0 2px 8px rgba(40, 40, 52, 0.08)",
        "glow-blue": "0 0 25px -5px rgba(65, 161, 207, 0.3)",
        "glow-card": "0 8px 30px -10px rgba(0, 0, 0, 0.08)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInQuick: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-quick": "fadeInQuick 0.4s ease-out forwards",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 4s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
