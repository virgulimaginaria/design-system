/**
 * Semantic colour tokens.
 *
 * Names describe the role a colour plays in an interface, never the screen,
 * product or business concept it appears in. Values are deliberately neutral
 * placeholders: consuming applications apply their own brand by overriding the
 * generated CSS variables (see the package README).
 *
 * Every `*-foreground` token is the text/icon colour meant to sit on top of its
 * base token and must keep a WCAG AA contrast ratio (4.5:1) against it.
 */
export const colors = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",

  surface: "oklch(1 0 0)",
  "surface-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",

  muted: "oklch(0.97 0 0)",
  "muted-foreground": "oklch(0.52 0 0)",
  accent: "oklch(0.97 0 0)",
  "accent-foreground": "oklch(0.205 0 0)",

  primary: "oklch(0.205 0 0)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.97 0 0)",
  "secondary-foreground": "oklch(0.205 0 0)",

  danger: "oklch(0.53 0.22 27)",
  "danger-foreground": "oklch(0.985 0 0)",
  success: "oklch(0.5 0.13 150)",
  "success-foreground": "oklch(0.985 0 0)",
  warning: "oklch(0.52 0.14 55)",
  "warning-foreground": "oklch(0.985 0 0)",

  border: "oklch(0.922 0 0)",
  input: "oklch(0.87 0 0)",
  ring: "oklch(0.556 0 0)",
} as const satisfies Record<string, string>

export type ColorToken = keyof typeof colors

/** Dark colour scheme. Must define every colour token. */
export const darkColors = {
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",

  surface: "oklch(0.205 0 0)",
  "surface-foreground": "oklch(0.985 0 0)",
  popover: "oklch(0.205 0 0)",
  "popover-foreground": "oklch(0.985 0 0)",

  muted: "oklch(0.269 0 0)",
  "muted-foreground": "oklch(0.72 0 0)",
  accent: "oklch(0.269 0 0)",
  "accent-foreground": "oklch(0.985 0 0)",

  primary: "oklch(0.922 0 0)",
  "primary-foreground": "oklch(0.205 0 0)",
  secondary: "oklch(0.269 0 0)",
  "secondary-foreground": "oklch(0.985 0 0)",

  danger: "oklch(0.72 0.17 22)",
  "danger-foreground": "oklch(0.145 0 0)",
  success: "oklch(0.75 0.15 150)",
  "success-foreground": "oklch(0.145 0 0)",
  warning: "oklch(0.8 0.15 75)",
  "warning-foreground": "oklch(0.145 0 0)",

  border: "oklch(1 0 0 / 12%)",
  input: "oklch(1 0 0 / 20%)",
  ring: "oklch(0.6 0 0)",
} as const satisfies Record<ColorToken, string>
