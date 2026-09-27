// @vitest-environment node
// Guards the package boundary: what consumers may import is exactly what the
// `exports` map lists, and every component has an explicit public entry.
import { readdirSync } from "node:fs"
import { createRequire } from "node:module"

import { describe, expect, it } from "vitest"

import * as copyButton from "@virgulimaginaria/ui/copy-button"
import * as copyableInput from "@virgulimaginaria/ui/copyable-input"
import * as copyableText from "@virgulimaginaria/ui/copyable-text"

import pkg from "../package.json" with { type: "json" }

const require = createRequire(import.meta.url)
const exportKeys = Object.keys(pkg.exports)

const componentFiles = readdirSync(new URL("./components", import.meta.url))
  .filter((file) => file.endsWith(".tsx") && !file.includes(".test."))
  .map((file) => file.replace(/\.tsx$/, ""))

describe("public API", () => {
  it("has no wildcard exports", () => {
    expect(exportKeys.filter((key) => key.includes("*"))).toEqual([])
  })

  it("exports every component through its own subpath", () => {
    for (const name of componentFiles) {
      expect(exportKeys).toContain(`./${name}`)
    }
  })

  it("resolves the documented subpaths", () => {
    for (const key of exportKeys) {
      expect(() =>
        require.resolve(`@virgulimaginaria/ui${key.slice(1)}`)
      ).not.toThrow()
    }
  })

  it.each([
    "@virgulimaginaria/ui",
    "@virgulimaginaria/ui/src/components/button",
    "@virgulimaginaria/ui/src/components/button.tsx",
    "@virgulimaginaria/ui/components/button",
    "@virgulimaginaria/ui/dist/components/button.js",
    // The clipboard hook is shared internally by the copy components only.
    "@virgulimaginaria/ui/use-copy-to-clipboard",
    "@virgulimaginaria/ui/hooks/use-copy-to-clipboard",
  ])("does not expose %s", (specifier) => {
    expect(() => require.resolve(specifier)).toThrow(
      /not defined by "exports"|No "exports" main defined/
    )
  })

  it.each([
    ["copy-button", copyButton, ["CopyButton"]],
    ["copyable-text", copyableText, ["CopyableText"]],
    ["copyable-input", copyableInput, ["CopyableInput"]],
  ])("exposes %s with exactly its component", (_, module, expected) => {
    expect(Object.keys(module).sort()).toEqual(expected)
  })

  it("depends on no documentation tooling or application", () => {
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })
    expect(
      deps.filter((dep) =>
        /storybook|^@virgulimaginaria\/(?!design-tokens$)/.test(dep)
      )
    ).toEqual([])
  })
})
