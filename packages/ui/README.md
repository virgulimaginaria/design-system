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
import { CopyButton } from "@virgulimaginaria/ui/copy-button"
import { CopyableInput } from "@virgulimaginaria/ui/copyable-input"
import { CopyableText } from "@virgulimaginaria/ui/copyable-text"
import { Input } from "@virgulimaginaria/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@virgulimaginaria/ui/tooltip"
import { cn } from "@virgulimaginaria/ui/utils"
```

| Entry point                           | Exports                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `@virgulimaginaria/ui/button`         | `Button`, `buttonVariants`, `ButtonProps`                                                   |
| `@virgulimaginaria/ui/copy-button`    | `CopyButton`, `CopyButtonProps`                                                             |
| `@virgulimaginaria/ui/copyable-input` | `CopyableInput`, `CopyableInputProps`                                                       |
| `@virgulimaginaria/ui/copyable-text`  | `CopyableText`, `CopyableTextProps`                                                         |
| `@virgulimaginaria/ui/input`          | `Input`, `InputProps`                                                                       |
| `@virgulimaginaria/ui/tooltip`        | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` and their `...Props` types |
| `@virgulimaginaria/ui/utils`          | `cn`, merges class names and resolves Tailwind conflicts                                    |
| `@virgulimaginaria/ui/styles.css`     | The stylesheet                                                                              |

No other path is importable. Props, states, variants and accessibility notes for each component are documented in Storybook.

## Copying values

`CopyButton`, `CopyableText` and `CopyableInput` copy a value to the clipboard in one action, so people never have to select text by hand (hard on touch screens). They share one internal implementation built on the asynchronous Clipboard API, which browsers provide in secure contexts (HTTPS or `localhost`).

**Display representation and clipboard representation are separate concerns**: show a readable form, copy the canonical one.

```tsx
<CopyableText value="509123456" displayValue="509 123 456" />

<CopyableInput
  value="PT50 0000 0000 0000 0000 0000 0"
  copyValue="PT50000000000000000000000"
  readOnly
/>

<CopyButton value="509123456" copyLabel="Copiar" copiedLabel="Copiado" />
```

Formatting and meaning of the value are up to the application. Details: [docs/clipboard.md](https://github.com/virgulimaginaria/design-system/blob/main/docs/clipboard.md).

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
