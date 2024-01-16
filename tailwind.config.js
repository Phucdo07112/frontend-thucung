/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'orange': '#FF642F',
      },
      flex: {
        '2': '2 2 0%',
        '4': '4 4 0%'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
