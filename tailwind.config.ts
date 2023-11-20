/** @type {import('tailwindcss').Config} */
import colors from "./src/themes/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: "#root",
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
};
