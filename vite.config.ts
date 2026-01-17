import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: "127.0.0.1",
    port: 8090,
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    setupFiles: ["src/lib/test-setup.ts"],
  },
});
