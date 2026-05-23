/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        void: "#050507",
        surface: "#0a0a0f",
        panel: "#0f0f17",
        border: "#1a1a2e",
        accent: {
          cyan: "#00d4ff",
          blue: "#4d7cfe",
          purple: "#8b5cf6",
          green: "#00ff88",
          orange: "#ff6b35",
          red: "#ff3b5c",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "data-flow": "dataFlow 1.5s linear infinite",
        "slide-in-right": "slideInRight 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-out-right": "slideOutRight 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-up": "fadeUp 0.4s ease-out",
        "modal-in": "modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.3), 0 0 10px rgba(0, 212, 255, 0.2)" },
          "100%": { boxShadow: "0 0 15px rgba(0, 212, 255, 0.6), 0 0 30px rgba(0, 212, 255, 0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        dataFlow: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        fadeUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        modalIn: {
          "0%": { transform: "scale(0.88)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
