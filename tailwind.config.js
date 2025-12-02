/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cristo': {
          primary: '#1B365D',    // Azul Royal Profundo (Autoridad)
          secondary: '#EADBC8',  // Crema suave / Champagne (Calidez)
          accent: '#C5A059',     // Dorado Antiguo (Excelencia)
          light: '#FDFBF7',      // Blanco hueso (Fondo limpio)
          dark: '#0F1F38',       // Azul casi negro (Textos)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'slow-spin': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}