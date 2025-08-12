// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Activa el modo oscuro con la clase `dark` en <html> o <body>
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Si usas componentes en src/components/ui (shadcn):
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
