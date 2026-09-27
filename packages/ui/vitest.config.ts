import react from "@vitejs/plugin-react"
import { defaultClientConditions } from "vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve `#components/*` & co. to the TypeScript sources.
    conditions: ["@virgulimaginaria/source", ...defaultClientConditions],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
