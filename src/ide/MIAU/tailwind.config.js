/* eslint-disable prettier/prettier */
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  theme: {
    colors: {
      fundo : "#DEDCFF",
      linha : "#A8A3EC",
      verde: "#EDFFF1",
    },
    extend: {
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

