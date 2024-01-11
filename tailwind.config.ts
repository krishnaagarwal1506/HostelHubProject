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
        slideinRight: {
          "0%": { transform: "translate(100%)" },
          "100%": { transform: "translate(0px)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        slidein: "slide 0.2s ease-out",
        slideOut: "slide 0.2s ease-in reverse",
        slideinRight: "slideinRight 0.2s ease-out",
        slideDown: "slideDown 0.2s ease-out",
        slideUp: "slideUp 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
