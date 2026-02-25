/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        olive_bright: "#52814d",
        olive: "#a8b6a6",
        olive_light: "#d1dcd0",
        orange: "#e29b03",
        textmain: "#2a2424",
      },
    },
  },
  plugins: [],
};
