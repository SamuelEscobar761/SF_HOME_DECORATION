/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFDE3',
          light: '#FFFCCC',
          dark: '#BEBB98',
          hover: '#FFFFFF',
          pressed: '#FFFFFF',
          disabled: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#7848B8',
          light: '#A562FC',
          dark: '#5C2B9E',
          hover: '#FFFFFF',
          pressed: '#440B8F',
          disabled: '#FFFFFF',
        },
        tertiary: {
          DEFAULT: '#EA91A9',
          light: '#F0AABC',
          dark: '#BE627A',
          hover: '#FFFFFF',
          pressed: '#FFFFFF',
          disabled: '#FFFFFF',
        },
        success: {
          DEFAULT: '#81CB86',
          light: '#8BD990',
          dark: '#67A26B',
          hover: '#FFFFFF',
          pressed: '#FFFFFF',
          disabled: '#FFFFFF',
        },
        neutral: {
          900: '#1F1E1C',
          800: '#33322F',
          700: '#73716D',
          600: '#8A8884',
          500: '#BAB8B3',
          400: '#D6D4D0',
          300: '#EBE8E4',
          200: '#F7F5F0',
          100: '#FCFCFA',
        },
        // Puedes agregar más colores según tus necesidades
      },
    },
  },
  plugins: [],
}
