import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"
import { defaultClientConditions, mergeConfig } from "vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    // Reads the real TypeScript types of the workspace packages so the props
    // tables document the public API.
    reactDocgen: "react-docgen-typescript",
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      // Relative asset URLs: the static build works below any path, such as
      // https://<owner>.github.io/design-system/.
      base: "./",
      plugins: [tailwindcss()],
      build: {
        rolldownOptions: {
          onwarn(warning, warn) {
            // Base UI marks its modules "use client" for React Server
            // Components; the directive is irrelevant in Storybook.
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") return
            warn(warning)
          },
        },
      },
      resolve: {
        // Consume the workspace packages from their TypeScript sources (see
        // the "@virgulimaginaria/source" export condition), so edits to
        // components hot-reload without rebuilding the packages.
        conditions: ["@virgulimaginaria/source", ...defaultClientConditions],
      },
    })
  },
}

export default config
