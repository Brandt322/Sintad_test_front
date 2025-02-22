/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-hide": {
          "scrollbar-width": "none" /* Firefox */,
          "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none" /* Safari and Chrome */,
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin" /* Firefox */,
          "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
        },
        ".scrollbar-thin::-webkit-scrollbar": {
          width: "10px" /* Safari and Chrome */,
        },
        ".scrollbar-thumb-orange": {
          "scrollbar-color": "bg-gray-800 #f1f1f1" /* Firefox */,
        },
        ".scrollbar-thumb-orange::-webkit-scrollbar-thumb": {
          background: "bg-gray-800" /* Safari and Chrome */,
        },
        ".transition-width": {
          transition: "width 0.3s ease",
        },
      };

      addUtilities(newUtilities);
    },
  ],
}

