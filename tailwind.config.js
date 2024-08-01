/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "xl:grid-cols-1",
    "xl:grid-cols-2",
    "xl:grid-cols-3",
    "xl:grid-cols-4",
    "xl:grid-cols-5",
    "xl:grid-cols-6",
    "lg:grid-cols-1",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
    "lg:grid-cols-4",
    "lg:grid-cols-5",
    "lg:grid-cols-6",
  ],
  theme: {
    fontFamily: {
      avenir: ["Avenir", "sans-serif"],
    },
    fontSize: {
      sm: "0.75rem",
      base: "0.85rem",
      lg: "1rem",
      xl: "1.1rem",
      "2xl": "1.2rem",
      "3xl": "1.3rem",
      "4xl": "1.5rem",
      "5xl": "2.0rem",
    },
    extend: {},
  },
  plugins: [],
};
