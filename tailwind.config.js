/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ['WorkRegular', 'Work Sans', 'sans-serif'],
        WorkThin: ['WorkThin', 'Work Sans', 'sans-serif'],
        WorkExtraLight: ['WorkExtraLight', 'Work Sans', 'sans-serif'],
        WorkLight: ['WorkLight', 'Work Sans', 'sans-serif'],
        WorkRegular: ['WorkRegular', 'Work Sans', 'sans-serif'],
        WorkMedium: ['WorkMedium', 'Work Sans', 'sans-serif'],
        WorkSemiBold: ['WorkSemiBold', 'Work Sans', 'sans-serif'],
        WorkBold: ['WorkBold', 'Work Sans', 'sans-serif'],
        WorkExtraBold: ['WorkExtraBold', 'Work Sans', 'sans-serif'],
        WorkBlack: ['WorkBlack', 'Work Sans', 'sans-serif'],
      },
      colors: {
        primary: '#542b2b',
        'primary-hover': '#462424',
        gray: '#717171',
        error: '#dc2626',
        line: '#e4ddd4',
        'line-strong': '#d7d0c8',
        surface: '#f4f0ea',
        muted: '#f7f3ef',
        mutedText: '#6b7280',
      },
      boxShadow: {
        card: '0 1px 2px rgba(84,43,43,0.06), 0 8px 20px rgba(84,43,43,0.06)',
        raised: '0 12px 32px rgba(84,43,43,0.12)',
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
    },
  },
  plugins: [],
};
