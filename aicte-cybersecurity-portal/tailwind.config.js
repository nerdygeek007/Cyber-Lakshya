/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        surface: "#0b1329",
        "surface-card": "rgba(15, 23, 42, 0.75)",
        "surface-card-hover": "rgba(30, 41, 59, 0.7)",
        border: "#1e293b",
        "border-glow": "rgba(56, 189, 248, 0.3)",
        cyan: {
          DEFAULT: "#00f2fe",
          glow: "#38bdf8",
        },
        indigo: {
          DEFAULT: "#6366f1",
          dark: "#4338ca",
        },
        emerald: {
          DEFAULT: "#10b981",
        },
        rose: {
          DEFAULT: "#f43f5e",
        },
        amber: {
          DEFAULT: "#f59e0b",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'cyan-glow': '0 0 20px rgba(0, 242, 254, 0.35)',
        'indigo-glow': '0 0 20px rgba(99, 102, 241, 0.35)',
      }
    },
  },
  plugins: [],
}
