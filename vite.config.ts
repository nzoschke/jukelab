import { sveltekit } from "@sveltejs/kit/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vitest/config";

const useHttps = process.env.HTTPS === "true";

export default defineConfig({
  plugins: useHttps ? [sveltekit(), basicSsl()] : [sveltekit()],
  server: {
    host: "127.0.0.1",
    port: 8090,
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    setupFiles: ["src/lib/test-setup.ts"],
  },
});
