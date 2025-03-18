/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxxl': '1980px', // Custom breakpoint for large screens (4K TV, etc.)
      },
    },
  },
  plugins: [],
};
