import { describe, expect, it } from "vitest"

import { renderTailwindThemeCss, renderTokensCss } from "./css.ts"
import {
  colors,
  cssVar,
  cssVariables,
  darkColors,
  darkCssVariables,
} from "./index.ts"

describe("colour tokens", () => {
  it("defines a dark value for every colour token", () => {
    expect(Object.keys(darkColors).sort()).toEqual(Object.keys(colors).sort())
  })

  it("pairs every *-foreground token with a base token", () => {
    const names = Object.keys(colors)
    for (const name of names.filter((n) => n.endsWith("-foreground"))) {
      expect(names).toContain(name.replace(/-foreground$/, ""))
    }
  })

  it("uses semantic kebab-case names only", () => {
    for (const name of Object.keys(colors)) {
      expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/)
    }
  })
})

describe("CSS variables", () => {
  it("exposes Tailwind-compatible variable names", () => {
    expect(cssVariables).toMatchObject({
      "--color-primary": colors.primary,
      "--spacing": "0.25rem",
      "--radius-md": "0.5rem",
      "--text-sm": "0.875rem",
      "--text-sm--line-height": "1.25rem",
    })
  })

  it("only overrides colours in the dark scheme", () => {
    for (const name of Object.keys(darkCssVariables)) {
      expect(name.startsWith("--color-")).toBe(true)
      expect(cssVariables).toHaveProperty(name)
    }
  })

  it("builds typed var() references", () => {
    expect(cssVar("--color-danger")).toBe("var(--color-danger)")
  })
})

describe("generated stylesheets", () => {
  it("renders plain CSS with a dark scheme override", () => {
    const css = renderTokensCss()
    expect(css).toContain(":root {")
    expect(css).toContain(`--color-background: ${colors.background};`)
    expect(css).toContain('.dark, [data-theme="dark"] {')
    expect(css).toContain(`--color-background: ${darkColors.background};`)
  })

  it("renders a Tailwind v4 theme", () => {
    const css = renderTailwindThemeCss()
    expect(css).toContain("@theme static {")
    expect(css).toContain("@layer base {")
    expect(css).toContain(`--color-primary: ${colors.primary};`)
  })
})
