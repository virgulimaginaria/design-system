import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores([
    "**/dist/",
    "**/storybook-static/",
    "**/coverage/",
    "**/.turbo/",
    "!**/.storybook/",
  ]),
  {
    files: ["**/*.{js,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    // Dependency direction: published packages never depend on documentation
    // tooling or on anything outside packages/.
    files: ["packages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["storybook", "storybook/*", "@storybook/*"],
              message: "Packages must not depend on Storybook.",
            },
            {
              group: ["@virgulimaginaria/storybook", "**/apps/**"],
              message: "Packages must not import from applications.",
            },
            {
              group: ["@virgulimaginaria/*/src/*"],
              message: "Import other packages through their public exports.",
            },
          ],
        },
      ],
    },
  },
  storybook.configs["flat/recommended"],
])
