/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // Just-In-Time (JIT) modunu ekledim
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      scale: {
        '175': '1.75',
      },
      animation: {
        'color-change': 'color-change 5s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        'color-change': {
          '0%, 100%': { backgroundColor: '#ff0000' },
          '50%': { backgroundColor: '#0000ff' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(255, 0, 0, 0.5)', // Kırmızı renkte özel gölge
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
