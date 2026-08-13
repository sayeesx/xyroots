import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        xyroots: {
          dark: "#074526",
          teal: "#00a264",
          mint: "#e6f7ed",
          cream: "#f7f9f8",
          yellow: "#f5c63c",
          text: "#18181b",
          muted: "#6b7280",
          "light-green": "#c8eed6",
          border: "#e4e8f0",
          success: "#00a264",
          white: "#ffffff",
          surface: "#f0f4f2",
        },
      },
      fontFamily: {
        sans: ["'Cabinet Grotesk'", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Instrument Serif'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
