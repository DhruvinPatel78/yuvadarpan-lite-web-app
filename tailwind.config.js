/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    fontFamily: {
      'WorkThin': ['WorkThin'],
      'WorkExtraLight': ['WorkExtraLight'],
      'WorkLight': ['WorkLight'],
      'WorkRegular': ['WorkRegular'],
      'WorkMedium': ['WorkMedium'],
      'WorkSemiBold': ['WorkSemiBold'],
      'WorkBold': ['WorkBold'],
      'WorkExtraBold': ['WorkExtraBold'],
      'WorkBlack': ['WorkBlack'],
    },
    extend: {
      colors: {
        primary: '#542b2b',
        gray: '#717171',
        error: "#FF0000",
      }
    },
  },
  plugins: [],
};
