import { type Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export const screens = {
  sm: 640,
  lg: 1024,
}

const tailwindScreens = Object.fromEntries(
  Object.entries(screens).map(([name, size]) => [name, `${size}px`])
)

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: tailwindScreens,
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
          100: '#F1F1F1',
          950: '#101010',
        },
        orange: {
          500: '#D87D4A',
          400: '#FBAF85',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
