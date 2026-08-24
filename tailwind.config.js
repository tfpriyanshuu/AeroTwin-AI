/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Scientific Earth & Satellite Hybrid Palette
        ivory: {
          50: '#fafbf9',
          100: '#f4f6f1',
          200: '#e8ede3',
          300: '#d7e0d0',
          400: '#b8c7ad',
        },
        graphite: {
          50: '#f8faf9',
          100: '#edf2ee',
          200: '#dbe4de',
          300: '#b9cbbe',
          400: '#8ca695',
          500: '#64826f',
          600: '#486352',
          700: '#34493d',
          800: '#233229',
          900: '#141d18',
          950: '#0b110e',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        olive: {
          50: '#f7f8f3',
          100: '#edf0e4',
          200: '#dbe0ca',
          500: '#738a58',
          600: '#5c7244',
          700: '#465734',
          800: '#38462a',
          900: '#2f3b24',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
        },
        rust: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        earth: {
          50: '#fbf9f7',
          100: '#f5f0ec',
          200: '#ebdcd3',
          500: '#a37152',
          700: '#6e452e',
          800: '#523423',
          900: '#3b2519',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        aqi: {
          good: '#16a34a',
          satisfactory: '#65a30d',
          moderate: '#d97706',
          poor: '#ea580c',
          verypoor: '#dc2626',
          severe: '#7f1d1d',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(19, 27, 23, 0.05), 0 1px 2px 0 rgba(19, 27, 23, 0.03)',
        'panel': '0 4px 6px -1px rgba(19, 27, 23, 0.07), 0 2px 4px -1px rgba(19, 27, 23, 0.04)',
        'elevation': '0 10px 15px -3px rgba(19, 27, 23, 0.08), 0 4px 6px -2px rgba(19, 27, 23, 0.04)',
      }
    },
  },
  plugins: [],
}
