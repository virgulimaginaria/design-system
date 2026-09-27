# ADR 0001: Design System foundation

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

Primeira Academia builds several web applications that need a consistent, accessible UI without each application re-implementing the same primitives. The foundation must be reusable by any future application and safe to develop in the open.

This record lists the initial decisions and why they were made, so they are not reopened without new evidence.

## Decisions

| Decision                             | Rationale                                                                                                                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dedicated repository**             | The Design System has its own lifecycle, versioning and consumers; keeping it apart from applications enforces the dependency direction (applications depend on it, never the reverse). |
| **Public repository**                | Allows free hosting of documentation (GitHub Pages) and encourages a strict separation from private business code and data. Consequence: every commit must be safe to publish.          |
| **MIT licence**                      | Simple, permissive licence for the source code. It explicitly does not cover trademarks or brand assets.                                                                                |
| **No restricted brand assets**       | Brand files cannot be redistributed under MIT. The Design System exposes tokens, CSS variables and slots; applications supply their own brand.                                          |
| **React + TypeScript**               | The stack of the consuming applications; types document and enforce the public API.                                                                                                     |
| **pnpm monorepo (workspaces)**       | Keeps tokens, components and documentation together with fast, strict dependency resolution and the `workspace:` protocol.                                                              |
| **Turborepo**                        | Orchestrates tasks across packages in dependency order, with caching, without custom scripts.                                                                                           |
| **shadcn/ui**                        | Provides well-designed component source that we own and can adapt, instead of a closed dependency. The CLI adds components to the shared `packages/ui` package.                         |
| **Base UI** as primitives            | Unstyled, accessible primitives (focus, keyboard, ARIA) maintained upstream; supported by shadcn (`base-nova` style).                                                                   |
| **Tailwind CSS v4**                  | The styling model of shadcn/ui; the theme is driven by CSS variables generated from the design tokens.                                                                                  |
| **Storybook (React + Vite)**         | The official catalogue and documentation, and the harness for interaction and axe accessibility tests.                                                                                  |
| **GitHub Pages** for Storybook       | Free, public hosting deployed by the official Pages actions; no manually maintained branch.                                                                                             |
| **GitHub Packages** for publication  | Registry integrated with the repository and its permissions; publishing uses the workflow token, no stored credentials.                                                                 |
| **Changesets**                       | Standard, per-package semantic versioning and changelogs driven by pull requests; no custom release tooling.                                                                            |
| **Domain-agnostic component policy** | The Design System contains reusable UI capabilities only. Business and domain components belong to the applications.                                                                    |

Also decided during the bootstrap:

- **npm scope `@virgulimaginaria`**: GitHub Packages requires the scope to match the repository owner. The product keeps the name "Primeira Academia Design System"; the scope is a publication detail.
- **Two packages only** (`ui`, `design-tokens`). Icons, hooks, themes or utilities get their own package only when a concrete need appears.
- **Explicit subpath exports** per component (`@virgulimaginaria/ui/button`), no wildcards and no barrel file, so the public API is deliberate and tree-shaking is trivial.
- **Compiled `dist/` with a source export condition**: consumers get plain ES modules and declarations; the monorepo consumes sources for fast feedback.

## Consequences

- Contributors must review every change for private information (see the README's public repository boundary).
- Consumers need a Tailwind CSS v4 build and authentication to GitHub Packages.
- The `@virgulimaginaria` npm scope must match the GitHub account that owns the repository for GitHub Packages publication (see [repository settings](../repository-settings.md)).
- Changing any decision above requires a new ADR that supersedes this one.
