// Every public component of @virgulimaginaria/ui must be documented here.
import { existsSync } from "node:fs"

import uiPackage from "@virgulimaginaria/ui/package.json" with { type: "json" }
import { describe, expect, it } from "vitest"

const nonComponentExports = new Set([
  "./utils",
  "./styles.css",
  "./package.json",
])

const components = Object.keys(uiPackage.exports)
  .filter((key) => !nonComponentExports.has(key))
  .map((key) => key.slice(2))

describe("component catalogue", () => {
  it.each(components)("documents %s with a story", (name) => {
    expect(
      existsSync(new URL(`./components/${name}.stories.tsx`, import.meta.url))
    ).toBe(true)
  })
})
