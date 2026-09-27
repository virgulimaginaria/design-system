import { colors, darkColors, type ColorToken } from "./color.ts"
import {
  breakpoints,
  duration,
  easing,
  fontFamily,
  fontSize,
  fontWeight,
  radius,
  shadow,
  spacing,
} from "./scales.ts"

/**
 * CSS custom property names.
 *
 * Names follow the Tailwind CSS v4 theme namespaces (`--color-*`,
 * `--radius-*`, `--text-*`, ...) so the same variables drive both plain CSS
 * consumers and Tailwind utilities such as `bg-primary` or `rounded-md`.
 */
type Prefixed<P extends string, K> = K extends string ? `${P}${K}` : never

type FontSizeToken = keyof typeof fontSize

export type ColorVariable = Prefixed<"--color-", ColorToken>

export type TokenVariable =
  | ColorVariable
  | "--spacing"
  | Prefixed<"--font-", keyof typeof fontFamily>
  | Prefixed<"--text-", FontSizeToken>
  | Prefixed<"--text-", `${FontSizeToken}--line-height`>
  | Prefixed<"--font-weight-", keyof typeof fontWeight>
  | Prefixed<"--radius-", keyof typeof radius>
  | Prefixed<"--shadow-", keyof typeof shadow>
  | Prefixed<"--duration-", keyof typeof duration>
  | Prefixed<"--ease-", keyof typeof easing>
  | Prefixed<"--breakpoint-", keyof typeof breakpoints>

function prefixed<P extends string, K extends string>(
  prefix: P,
  values: Readonly<Record<K, string>>
): Record<Prefixed<P, K>, string> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [`${prefix}${key}`, value])
  ) as Record<Prefixed<P, K>, string>
}

function textVariables() {
  const entries = Object.entries(fontSize).flatMap(([key, value]) => [
    [`--text-${key}`, value.size],
    [`--text-${key}--line-height`, value.lineHeight],
  ])
  return Object.fromEntries(entries) as Record<
    Prefixed<"--text-", FontSizeToken | `${FontSizeToken}--line-height`>,
    string
  >
}

/** Every token as a CSS variable, using the default (light) colour scheme. */
export const cssVariables: Readonly<Record<TokenVariable, string>> = {
  ...prefixed("--color-", colors),
  "--spacing": spacing.unit,
  ...prefixed("--font-", fontFamily),
  ...textVariables(),
  ...prefixed("--font-weight-", fontWeight),
  ...prefixed("--radius-", radius),
  ...prefixed("--shadow-", shadow),
  ...prefixed("--duration-", duration),
  ...prefixed("--ease-", easing),
  ...prefixed("--breakpoint-", breakpoints),
}

/** Colour variables overridden by the dark colour scheme. */
export const darkCssVariables: Readonly<Record<ColorVariable, string>> =
  prefixed("--color-", darkColors)

/**
 * Typed reference to a token for use in inline styles or CSS-in-JS:
 * `cssVar("--color-primary")` returns `"var(--color-primary)"`.
 */
export function cssVar<T extends TokenVariable>(name: T): `var(${T})` {
  return `var(${name})`
}
