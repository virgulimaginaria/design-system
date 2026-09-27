# Primeira Academia Design System

The Primeira Academia Design System is a public, reusable UI foundation for building consistent web applications across the Primeira Academia ecosystem.

It provides:

- **shared design tokens**: colour, spacing, typography, radii, elevation, motion and breakpoints;
- **accessible UI primitives**, built on [Base UI](https://base-ui.com);
- **reusable components**, implemented with [shadcn/ui](https://ui.shadcn.com) and [Tailwind CSS](https://tailwindcss.com);
- **consistent interaction patterns**, documented and tested in [Storybook](https://storybook.js.org).

The Design System is **public**, **reusable**, **application-agnostic**, **domain-agnostic** and **intentionally free of restricted brand assets**.

## What this repository is

A pnpm + Turborepo monorepo containing the Design System packages and their documentation:

```text
apps/
  storybook/            interactive catalogue and documentation (not published)
packages/
  design-tokens/        @virgulimaginaria/design-tokens
  ui/                   @virgulimaginaria/ui
docs/                   architecture, contribution guides and decision records
```

It contains **no** application code, business logic, backend services or configuration of any environment.

## Principles

1. **Reusable UI capabilities only.** Components describe _how_ an interface behaves (a button, a field, a copy action), never _what_ business concept it shows.
2. **Accessible by default.** Keyboard support, visible focus, correct semantics and sufficient contrast are requirements, verified automatically.
3. **Explicit public API.** Each component has its own documented entry point; nothing else can be imported.
4. **Composition over specialisation.** Prefer combining existing components to adding near-duplicates.
5. **One behaviour, one implementation.** Shared behaviour (for example, copying to the clipboard) lives in one place and is reused.
6. **Boring, standard tooling.** shadcn/ui, Base UI, Tailwind, Storybook, Changesets: no custom frameworks.

## Packages

| Package                                                               | Description                                                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`@virgulimaginaria/ui`](packages/ui/README.md)                       | React components (`Button`, `Input`, `Tooltip`, ...) and the stylesheet that themes them. |
| [`@virgulimaginaria/design-tokens`](packages/design-tokens/README.md) | Semantic tokens as TypeScript values, plain CSS variables and a Tailwind CSS v4 theme.    |

## Installation

The packages are published to **GitHub Packages** under the `@virgulimaginaria` npm scope (GitHub Packages requires the scope to match the account that owns this repository). GitHub Packages requires authentication even for public packages.

1. Create a GitHub personal access token (classic) with the `read:packages` scope. In GitHub Actions, the workflow's `GITHUB_TOKEN` with `packages: read` permission is enough.
2. Map the scope to GitHub Packages in the application's `.npmrc`, reading the token from an environment variable (never commit the token itself):

   ```ini
   @virgulimaginaria:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

3. Install the packages and their peer dependencies (React 19 and Tailwind CSS 4):

   ```bash
   NODE_AUTH_TOKEN=<token> pnpm add @virgulimaginaria/ui @virgulimaginaria/design-tokens
   pnpm add react react-dom
   pnpm add -D tailwindcss @tailwindcss/vite
   ```

## Basic usage

Import Tailwind and the Design System stylesheet once, in the application's main stylesheet:

```css
@import "tailwindcss";
@import "@virgulimaginaria/ui/styles.css";
```

Then import each component from its own entry point:

```tsx
import { Button } from "@virgulimaginaria/ui/button"
import { Input } from "@virgulimaginaria/ui/input"

export function SearchForm() {
  return (
    <form className="flex gap-2">
      <label htmlFor="query" className="sr-only">
        Search
      </label>
      <Input id="query" type="search" />
      <Button type="submit">Search</Button>
    </form>
  )
}
```

Only the documented entry points are public (`@virgulimaginaria/ui/button`, `@virgulimaginaria/ui/input`, `@virgulimaginaria/ui/tooltip`, `@virgulimaginaria/ui/utils`, `@virgulimaginaria/ui/styles.css`). Internal paths such as `@virgulimaginaria/ui/src/...` are blocked by the package's `exports` map.

### Where applications stand

> Applications consuming the Design System should use it as the default source for reusable UI.

Before implementing a new UI component inside an application:

1. Check whether the Design System already provides the capability (see Storybook).
2. If it does not, determine whether the capability is generic and reusable enough to belong in the Design System.
3. Keep it application-local only when it is specific to that application or business domain.

```text
Design System
    reusable UI capabilities

Applications
    business/domain components
```

## Storybook

Storybook is the official interactive catalogue and documentation of the Design System. It documents each component's purpose, props, states, variants and accessibility considerations, rendered from the real workspace packages.

- Public Storybook (after GitHub Pages is enabled): **https://virgulimaginaria.github.io/design-system/**. The URL follows `https://<owner>.github.io/design-system/`, so it changes if the repository moves to another owner.
- Locally: `pnpm storybook`, then open http://localhost:6006.

## Development

Requirements: Node.js 24 or later (see [`.nvmrc`](.nvmrc)) and pnpm (the version is pinned in `package.json`; `npm install -g pnpm` or Corepack will pick it up).

```bash
pnpm install          # install dependencies
pnpm storybook        # browse and develop components
pnpm check            # full local validation (what CI runs)
```

| Command                | What it does                                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| `pnpm storybook`       | Starts Storybook with hot reload on the package sources.               |
| `pnpm build`           | Builds the publishable packages into `packages/*/dist`.                |
| `pnpm build-storybook` | Builds the static Storybook into `apps/storybook/storybook-static`.    |
| `pnpm test`            | Unit tests (Vitest + Testing Library) and story tests with axe audits. |
| `pnpm lint`            | ESLint.                                                                |
| `pnpm typecheck`       | TypeScript, without emitting.                                          |
| `pnpm format`          | Formats everything with Prettier (`format:check` only checks).         |
| `pnpm check`           | All of the above, in CI order.                                         |
| `pnpm changeset`       | Describes a change for the next release.                               |

The story tests run in Chromium through Playwright. Install it once with `pnpm --filter @virgulimaginaria/storybook exec playwright install chromium`.

## Adding components

Components are added to the shared `packages/ui` package with the shadcn CLI, never copied into applications:

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component>
```

Every public component then needs a typed API, an entry in the package `exports`, a Storybook story, tests and an accessibility review. The full workflow and checklist are in [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/contributing-components.md](docs/contributing-components.md).

## Public repository boundary

This repository is public by design. **Everything committed to it must be safe to expose publicly.**

It must never contain secrets, credentials, API keys or tokens; internal URLs, environment details, infrastructure information or production configuration; customer, student or employee data, or real operational examples; internal permissions, business rules or private documents.

Examples, stories and tests use fictional or generic data only (for example "Ada Lovelace", `name@example.com`).

## Brand independence

The Design System is intentionally **free of restricted or private brand assets**: it contains no proprietary logos, restricted illustrations, fonts that cannot be redistributed, or private images. It uses system font stacks and neutral placeholder colours.

What it does provide are the extension points that let an application apply its own brand:

- design tokens exposed as CSS variables (`--color-primary`, `--radius-md`, `--font-sans`, ...) that can be overridden in the application's stylesheet;
- component `className` and Base UI `render` props for composition;
- slots such as `children` for application-provided content, including logos.

Brand assets themselves remain outside this repository.

## Releases and versioning

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets), following semantic versioning. Each package is versioned independently.

```text
feature/change → changeset → merge into main → "Version Packages" PR → merge → publish to GitHub Packages
```

Breaking changes to the public API (a removed or renamed component, prop, variant or token) require a **major** changeset. Only packages with a new version are published; nothing is published from feature branches.

## Repository settings

Some required configuration lives in the GitHub repository settings rather than in files. See [docs/repository-settings.md](docs/repository-settings.md) for the one-time setup (Pages source, Actions permissions, branch ruleset, merge options).

## License

The source code is licensed under the [MIT License](LICENSE).

The MIT licence applies to the source code in this repository only. It does not grant any right to use the Primeira Academia or Vírgulimaginária names, trademarks, logos or other brand assets.
