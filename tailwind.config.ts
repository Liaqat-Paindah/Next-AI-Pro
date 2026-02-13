import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6ABAE1",
        secondary: "#03396C",
        accent: "#D8F0F4",
        dark: "#001F4B",
        light: "#F8FAFC",
        success: "#005B96",
      },
    },
  },
  plugins: [],
};

export default config;
