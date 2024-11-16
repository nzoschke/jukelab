import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    {
      pattern: /text-(info|error|success|warning)/,
    },
  ],
  daisyui: {
    logs: false,
    themes: ["light", "dark", "corporate"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
