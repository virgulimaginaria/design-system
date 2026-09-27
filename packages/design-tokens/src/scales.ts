/**
 * Non-colour foundation scales: spacing, typography, radii, elevation, motion
 * and breakpoints. These are generic starting values, not a final visual
 * identity.
 */

/** Base spacing unit. Every spacing step is a multiple of this value. */
export const spacing = {
  unit: "0.25rem",
} as const

/** System font stacks only: no font files are shipped by this package. */
export const fontFamily = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
} as const

/** Font sizes paired with their line heights. */
export const fontSize = {
  xs: { size: "0.75rem", lineHeight: "1rem" },
  sm: { size: "0.875rem", lineHeight: "1.25rem" },
  base: { size: "1rem", lineHeight: "1.5rem" },
  lg: { size: "1.125rem", lineHeight: "1.75rem" },
  xl: { size: "1.25rem", lineHeight: "1.75rem" },
  "2xl": { size: "1.5rem", lineHeight: "2rem" },
  "3xl": { size: "1.875rem", lineHeight: "2.25rem" },
} as const

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.625rem",
  xl: "0.875rem",
  "2xl": "1.125rem",
} as const

/** Elevation expressed as box shadows, from subtle to prominent. */
export const shadow = {
  sm: "0 1px 2px 0 oklch(0 0 0 / 0.05)",
  md: "0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)",
} as const

/**
 * Motion. Components must respect `prefers-reduced-motion`; these values are
 * the upper bound for non-essential animation.
 */
export const duration = {
  fast: "100ms",
  normal: "200ms",
  slow: "300ms",
} as const

export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const

/** Minimum viewport widths. */
export const breakpoints = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const
