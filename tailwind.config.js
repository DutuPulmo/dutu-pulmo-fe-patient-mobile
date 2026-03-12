/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0A7CFF',
        secondary: '#22C55E',
        'background-light': '#F8FAFC',
        'background-dark': '#18181B',
        'surface-light': '#FFFFFF',
        'surface-dark': '#27272A',
        'text-light': '#1F2937',
        'text-dark': '#E5E7EB',
        'border-light': '#E2E8F0',
        'border-dark': '#3F3F46',
      },
    },
  },
  plugins: [],
}
