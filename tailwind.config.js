/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        primary: {
          DEFAULT: '#055e4c', // Cor original
          dark: '#044d3f', // Tom mais escuro
        },
        secondary: {
          DEFAULT: '#007673',
          dark: '#005d58',
        },
        accent: {
          DEFAULT: '#fdbc58',
          dark: '#c79b4a',
        },
        success: {
          DEFAULT: '#056926',
          dark: '#04521f',
        },
        info: {
          DEFAULT: '#2ecfda',
          dark: '#239f9b',
        },
        danger: {
          DEFAULT: '#4138cb',
          dark: '#352f9b',
        },
      }
    },
  },
  plugins: [],
}
