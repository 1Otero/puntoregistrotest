/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        success: colors.green,
        primary: colors.blue,
        greenface: 'rgb(66,183,42)',
        blueLogo: 'rgb(17,85,204)',
        greenLogo: 'rgb(106,168,79)',
        grayLogo: 'rgb(153,153,153)',
        greenIngress: 'rgb(150,232,31)',
      },
      width: {
        '15': '15%',
        '85': '85%',
        '11': '10%',
        '91': '90%',
        '25': '25%',
        '75': '75%',
      },
      height: {
        '200': '20%',
        '800': '80%',
        '840': '84%',
      },

    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

