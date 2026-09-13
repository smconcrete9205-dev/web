import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0a1929",
        },
        concrete: {
          50: "#f7f7f6",
          100: "#eeeeec",
          200: "#dcdcd8",
          300: "#c2c2bc",
          400: "#a3a39b",
          500: "#87877d",
          600: "#6c6c63",
          700: "#57564f",
          800: "#464540",
          900: "#3a3936",
        },
        accent: {
          50: "#fff8eb",
          100: "#feecc7",
          200: "#fdd88a",
          300: "#fcbf4d",
          400: "#fba524",
          500: "#f5840b",
          600: "#da6206",
          700: "#b54209",
          800: "#92330e",
          900: "#792b0f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
