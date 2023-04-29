import { type Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: colors.white,
      black: colors.black,
      gray: colors.neutral,
    },
    extend: {
      colors: {
        gray: {
          50: '#FAFAFA',
          100: 'F1F1F1',
          950: '#101010',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
