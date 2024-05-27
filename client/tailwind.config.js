/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-dark-gray': '#2f2f2f',
        'custom-light-gray': '#bfbfbf',
        'custom-charcoal': '#36454f',
        'custom-ash-gray': '#e0e0e0',
        'custom-slate': '#708090',
        'custom-flint-gray': '#6e7f80'
      },
      backgroundImage: {
        'cow-pattern': "url('https://cdn.discordapp.com/attachments/534883976205303831/1239381797838651514/Screenshot_2024-05-13_040034.jpg?ex=66552cbf&is=6653db3f&hm=7a16f0e9cd82827fbd14bd12a1ee29a0425d6f6bf702de441c60c5eeec1233c6&')",
        'dark-gray-to-light-gray': 'linear-gradient(to right, #2f2f2f, #bfbfbf)',
        'charcoal-to-ash-gray': 'linear-gradient(to right, #36454f, #e0e0e0)',
        'slate-to-flint-gray': 'linear-gradient(to right, #708090, #6e7f80)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // другие плагины...
  ],
};