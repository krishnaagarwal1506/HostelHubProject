/** @type {import('tailwindcss').Config} */
import colors from "./src/themes/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: "#root",
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      keyframes: {
        slide: {
          "0%": { transform: "translate(-100%)" },
          "100%": { transform: "translate(0px)" },
        },
      },
      animation: {
        slidein: "slide 0.3s ease-out",
        slideOut: "slide 0.3s ease-in reverse",
      },
    },
  },
  plugins: [],
};
