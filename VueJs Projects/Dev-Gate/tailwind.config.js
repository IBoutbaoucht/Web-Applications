// tailwind.config.js

module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode support with "dark" class
  theme: {
    extend: {
      colors: {
        // you can customize if needed
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["dark", "hover", "active"],
      textColor: ["dark", "hover", "active"],
      borderColor: ["dark", "hover", "focus"],
    },
  },
  plugins: [],
};
