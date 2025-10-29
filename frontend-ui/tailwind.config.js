export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        dark: '#121212',
        'dark-secondary': '#181818',
        'dark-tertiary': '#282828',
        'dark-hover': '#2a2a2a',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}