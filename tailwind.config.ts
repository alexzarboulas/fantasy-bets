// tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        brand: "#0b1020",
        ink: "#e6e8ef",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;