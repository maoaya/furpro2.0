/**
 * Configuración profesional de Tailwind CSS para FutPro 2.0
 * Incluye dark mode, animaciones, colores personalizados, fuentes y plugins recomendados.
 */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        black: '#181818',
        zinc: {
          900: '#18181b',
        },
        yellow: {
          400: '#FFD700',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        '2xl': '0 8px 32px 0 rgba(34,34,34,0.18)',
        'yellow': '0 4px 24px #FFD70033',
      },
      animation: {
        fadeInUp: 'fadeInUp 0.7s',
        fadeInScale: 'fadeInScale 0.7s',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
