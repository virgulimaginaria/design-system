# @virgulimaginaria/ui

Accessible, domain-agnostic React components for the [Primeira Academia Design System](https://github.com/virgulimaginaria/design-system), built with [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com) primitives and styled with Tailwind CSS v4.

## Requirements

- React 19
- Tailwind CSS 4 in the application's build (the package ships class names, not precompiled CSS)
- Access to GitHub Packages (see the [repository README](https://github.com/virgulimaginaria/design-system#installation))

## Setup

```bash
pnpm add @virgulimaginaria/ui
```

In the application's main stylesheet:

```css
@import "tailwindcss";
@import "@virgulimaginaria/ui/styles.css";
```

The stylesheet brings the design tokens (from `@virgulimaginaria/design-tokens`), the dark scheme (`.dark` or `[data-theme="dark"]`) and base styles.

## Usage

Import each component from its own entry point:

```tsx
import { Button } from "@virgulimaginaria/ui/button"
import { Input } from "@virgulimaginaria/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@virgulimaginaria/ui/tooltip"
import { cn } from "@virgulimaginaria/ui/utils"
```

| Entry point                       | Exports                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `@virgulimaginaria/ui/button`     | `Button`, `buttonVariants`, `ButtonProps`                                                   |
| `@virgulimaginaria/ui/input`      | `Input`, `InputProps`                                                                       |
| `@virgulimaginaria/ui/tooltip`    | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` and their `...Props` types |
| `@virgulimaginaria/ui/utils`      | `cn`, merges class names and resolves Tailwind conflicts                                    |
| `@virgulimaginaria/ui/styles.css` | The stylesheet                                                                              |

No other path is importable. Props, states, variants and accessibility notes for each component are documented in Storybook.

## Branding

Override the design-token CSS variables after importing the stylesheet, for both colour schemes:

```css
@layer base {
  :root {
    --color-primary: oklch(0.45 0.15 260);
  }
  .dark,
  [data-theme="dark"] {
    --color-primary: oklch(0.75 0.12 260);
  }
}
```

## License

MIT. The licence does not grant rights to Primeira Academia trademarks or brand assets.
