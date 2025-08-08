/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.{js,jsx,ts,tsx}",      // root app file
    "./src/**/*.{js,jsx,ts,tsx}", // all components in src/
    "./app/**/*.{js,jsx,ts,tsx}"  // if using Expo Router or app directory
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
