// Every `*-foreground` colour must keep WCAG AA contrast (4.5:1) against its
// base colour, in both colour schemes. Storybook's axe audit only sees the
// light scheme, so the dark scheme is checked here.
import { describe, expect, it } from "vitest"

import { colors, darkColors, type ColorToken } from "./color.ts"

/** Relative luminance of an opaque `oklch(L C H)` colour, gamut-clipped. */
function luminance(value: string): number {
  const match = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(value)
  if (!match) throw new Error(`Not an opaque oklch() colour: ${value}`)
  const [l, c, h] = match.slice(1).map(Number) as [number, number, number]
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3

  const clip = (x: number) => Math.min(1, Math.max(0, x))
  const r = clip(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_)
  const g = clip(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_)
  const bl = clip(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_)
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ]
  return (hi + 0.05) / (lo + 0.05)
}

const pairs = [
  ["background", "foreground"],
  ["background", "muted-foreground"],
  ["muted", "muted-foreground"],
  ...Object.keys(colors)
    .filter(
      (name) => name.endsWith("-foreground") && name !== "muted-foreground"
    )
    .map((name) => [name.replace(/-foreground$/, ""), name]),
] as [ColorToken, ColorToken][]

describe.each([
  ["light", colors],
  ["dark", darkColors],
] as const)("%s scheme contrast", (_scheme, scheme) => {
  it.each(pairs)("%s / %s is at least 4.5:1", (base, foreground) => {
    expect(contrast(scheme[base], scheme[foreground])).toBeGreaterThanOrEqual(
      4.5
    )
  })
})
