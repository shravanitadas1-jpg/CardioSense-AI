/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#04070A",
          soft: "#080D13",
        },
        panel: "#0B1420",
        line: "#16232E",
        cyan: {
          glow: "#22D3EE",
        },
        blue: {
          glow: "#3B82F6",
        },
        monitor: {
          green: "#39FF9C",
          amber: "#FFB94A",
          red: "#FB7185",
        },
        ink: {
          primary: "#E7F1F7",
          muted: "#7E93A3",
          faint: "#4B5C69",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(34,211,238,0.35)",
        "glow-sm": "0 0 18px -4px rgba(34,211,238,0.4)",
        "glow-green": "0 0 24px -4px rgba(57,255,156,0.45)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(180deg, rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 30%, rgba(34,211,238,0.14), transparent 60%)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "80%": { opacity: "0" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.2,0.6,0.4,1) infinite",
        scanline: "scanline 2.6s linear infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        blink: "blink 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};