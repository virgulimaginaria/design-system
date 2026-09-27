# Architecture

## Layers

Components are built in layers. Each layer depends only on the layers above it.

```text
Base UI
   ↓
shadcn component implementation
   ↓
@virgulimaginaria/ui
   ↓
consuming web applications
```

- **Base UI** (`@base-ui/react`) provides unstyled, accessible primitives: behaviour, focus management, keyboard interaction and ARIA.
- **shadcn/ui** provides the component source code (the `base-nova` style), copied into `packages/ui` with the shadcn CLI and owned by this repository from then on.
- **`@virgulimaginaria/ui`** adds the Design System's API decisions, documentation and tests, and publishes the result.
- **Applications** compose these components with their own business components.

Tokens follow the same direction:

```text
@virgulimaginaria/design-tokens
             ↓
@virgulimaginaria/ui
             ↓
applications
```

`@virgulimaginaria/design-tokens` defines every token once, in TypeScript, and generates the CSS variables and the Tailwind theme from it. `@virgulimaginaria/ui/styles.css` imports that theme, so applications get the tokens through the ui stylesheet; they may also use the tokens package directly.

**Dependencies never point from the Design System towards consuming applications.** Packages never import application code, business concepts or configuration. This is enforced by lint rules (`no-restricted-imports` in `eslint.config.js`) and by the `public-api` test in `packages/ui`.

## Storybook

```text
Design System packages
        ├── consumed by applications
        └── consumed by Storybook
```

Storybook (`apps/storybook`) is documentation and testing infrastructure. It consumes the packages exactly as an application does, through their public entry points, and is published as a static site to GitHub Pages. It is **not** a runtime dependency of applications and packages never depend on it.

In development, Storybook resolves the packages to their TypeScript sources (see below), so changes hot-reload without a rebuild.

## Package layout and public API

```text
packages/ui/
  src/components/   one file per component (button.tsx, copy-button.tsx, ...)
  src/hooks/        internal React hooks (use-copy-to-clipboard.ts)
  src/lib/          internal helpers (utils.ts: cn)
  src/styles/       globals.css → published as styles.css
  components.json   shadcn CLI configuration
```

The public API is exactly the `exports` map of each `package.json`:

| Entry point                                  | Contents                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| `@virgulimaginaria/ui/button`                | `Button`, `buttonVariants`, `ButtonProps`                                        |
| `@virgulimaginaria/ui/copy-button`           | `CopyButton`, `CopyButtonProps`                                                  |
| `@virgulimaginaria/ui/copyable-input`        | `CopyableInput`, `CopyableInputProps`                                            |
| `@virgulimaginaria/ui/copyable-text`         | `CopyableText`, `CopyableTextProps`                                              |
| `@virgulimaginaria/ui/input`                 | `Input`, `InputProps`                                                            |
| `@virgulimaginaria/ui/tooltip`               | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` and their props |
| `@virgulimaginaria/ui/utils`                 | `cn` (class merging)                                                             |
| `@virgulimaginaria/ui/styles.css`            | The stylesheet (tokens, theme, component classes)                                |
| `@virgulimaginaria/design-tokens`            | Typed token values, `cssVariables`, `cssVar()`                                   |
| `@virgulimaginaria/design-tokens/tokens.css` | Plain CSS variables                                                              |
| `@virgulimaginaria/design-tokens/theme.css`  | Tailwind CSS v4 theme                                                            |

There are no wildcard exports, so any other path (`@virgulimaginaria/ui/src/...`, `.../dist/...`) fails to resolve. Inside `packages/ui`, modules refer to each other through Node.js [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) (`#components/*`, `#hooks/*`, `#lib/*`), which are private to the package.

### Source and build

Packages are published as compiled ES modules with type declarations (`dist/`), built with `tsc`: no bundler, one output file per source file.

Each export also declares a custom condition, `@virgulimaginaria/source`, pointing at the TypeScript source. Workspace tooling (Storybook, Vitest, `tsc`) enables that condition, so inside the monorepo the packages are consumed from source. Consumers never enable it and resolve the compiled `dist/` files.

### Styles

Components are styled with Tailwind CSS v4 utility classes. The package does not ship precompiled utilities: `styles.css` contains a `@source` directive pointing at the package's own components, so the application's Tailwind build generates exactly the classes they use, together with the application's own. That is why Tailwind CSS 4 is a peer dependency.

The stylesheet also vendors `shadcn/tailwind.css` (custom variants and keyframes used by shadcn components) at build time, so consumers never install the shadcn CLI.

Theming is done with CSS variables: the dark scheme applies inside `.dark` or `[data-theme="dark"]`, and applications apply their brand by overriding token variables such as `--color-primary`.

## Build, test and release pipeline

- **Turborepo** orchestrates `build`, `lint`, `typecheck`, `test`, `storybook` and `build-storybook` across the workspace, respecting dependencies (tokens build before ui; Storybook needs both) and caching results.
- **Vitest** runs unit tests in each package (jsdom + Testing Library) and, in Storybook, every story in Chromium with its `play` function and an axe audit (`@storybook/addon-vitest`, `@storybook/addon-a11y`).
- **GitHub Actions**: `ci.yml` validates; `storybook-pages.yml` publishes Storybook; `release.yml` runs Changesets to version and publish to GitHub Packages.

## Capabilities

- [Clipboard / copy interactions](clipboard.md): one shared, internal clipboard behaviour behind `CopyButton`, `CopyableText` and `CopyableInput`.
