import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: {
          base: "#0a0a0c",
          card: "#121215",
          elevated: "#1c1c1e",
          secondary: "#161617",
          border: "rgba(255, 255, 255, 0.08)",
        },
        apple: {
          blue: "#0071e3",
          "blue-hover": "#0077ed",
          "blue-dark": "#2997ff",
          gray: "#86868b",
          "gray-light": "#a1a1a6",
          "gray-card": "#1d1d1f",
          text: "#f5f5f7",
          subtle: "rgba(255, 255, 255, 0.04)",
        },
        system: {
          green: "#30d158",
          yellow: "#ffd60a",
          red: "#ff453a",
          orange: "#ff9f0a",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        bento: "22px",
        card: "18px",
        pill: "9999px",
      },
      boxShadow: {
        "apple-card": "0 8px 30px rgba(0, 0, 0, 0.6)",
        "apple-specular": "inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "apple-elevated": "0 14px 40px rgba(0, 0, 0, 0.75)",
        "apple-inner": "inset 0 0.5px 0.5px 0 rgba(255, 255, 255, 0.15)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
