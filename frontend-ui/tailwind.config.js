export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1DB954",
        dark: "#121212",
        "dark-secondary": "#181818",
        "dark-tertiary": "#282828",
        "dark-hover": "#2a2a2a",
      },
      screens: {
        xs: "475px",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      transitionDuration: {
        400: "400ms",
      },
      fontSize: {
        xxs: "0.625rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
