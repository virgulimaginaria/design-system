import { fileURLToPath } from "node:url"

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

const storybookDir = fileURLToPath(new URL("./.storybook", import.meta.url))

export default defineConfig({
  test: {
    projects: [
      {
        // Every story is rendered in a real browser, its play function is
        // run, and axe checks it for accessibility violations.
        extends: true,
        plugins: [storybookTest({ configDir: storybookDir })],
        test: {
          name: "stories",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        test: {
          name: "catalogue",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
    ],
  },
})
