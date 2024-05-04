import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        100: '25rem',
      },
      width: {
        88: '22rem',
      },
      spacing: {
        17: '4.25rem',
      },
      zIndex: {
        500: '500',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
export default config;
