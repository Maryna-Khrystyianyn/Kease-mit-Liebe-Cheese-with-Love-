/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"], // обов’язково вкажи шлях до всіх компонентів
  presets: [require("nativewind/preset")], // <- це ключовий момент!
  theme: {
    extend: {
      colors: {
        olive_bright: "#52814d",
        olive: "#a8b6a6",
        orange: "#e29b03",
        textmain: "#2a2424",
      },
    },
  },
  plugins: [],
};
