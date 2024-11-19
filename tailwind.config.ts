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
    extend: {
      animation: {
        "infinite-scroll": "infinite-scroll 300s linear infinite",
        "infinite-scroll-reverse": "infinite-scroll-reverse 300s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "infinite-scroll-reverse": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
