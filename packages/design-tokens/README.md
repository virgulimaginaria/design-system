# @virgulimaginaria/design-tokens

Generic, semantic design tokens for the [Primeira Academia Design System](https://github.com/virgulimaginaria/design-system): colour, spacing, typography, radii, elevation, motion and breakpoints.

Tokens are defined once, in TypeScript (`src/`), and published as:

| Import                                       | Contents                                                                                |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| `@virgulimaginaria/design-tokens`            | Typed values (`colors`, `radius`, ...), `cssVariables` and `cssVar()`.                  |
| `@virgulimaginaria/design-tokens/tokens.css` | Plain CSS custom properties on `:root`, dark scheme on `.dark` / `[data-theme="dark"]`. |
| `@virgulimaginaria/design-tokens/theme.css`  | The same variables as a Tailwind CSS v4 `@theme`, so utilities like `bg-primary` exist. |

Applications using `@virgulimaginaria/ui` get the tokens through `@virgulimaginaria/ui/styles.css` and do not need to import them separately.

## Naming

Variable names are semantic and follow the Tailwind v4 theme namespaces:

```text
--color-background   --color-foreground   --color-muted     --color-border
--color-primary      --color-danger       --color-success   --color-warning
--spacing            --radius-md          --text-sm         --font-sans
--shadow-md          --duration-normal    --ease-standard   --breakpoint-lg
```

Each `*-foreground` colour is the text colour to use on its base colour. Names never refer to an application, screen or business concept.

## Usage

```css
/* Without Tailwind */
@import "@virgulimaginaria/design-tokens/tokens.css";

.panel {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: calc(var(--spacing) * 4);
}
```

```ts
import { cssVar, radius } from "@virgulimaginaria/design-tokens"

const style = { color: cssVar("--color-danger") } // "var(--color-danger)", type-checked
```

The values are neutral placeholders, not a final visual identity. Applications apply their brand by overriding the variables.

## Changing tokens

Edit `src/color.ts` or `src/scales.ts`, then `pnpm build`. The CSS files are generated; never edit them. Every colour must have a dark value, and renaming or removing a token is a breaking change (major changeset).

## License

MIT. The licence does not grant rights to Primeira Academia trademarks or brand assets.
