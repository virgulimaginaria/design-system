# Contributing

This guide is for human and agent contributors. Agents must also follow [AGENTS.md](AGENTS.md).

## Local setup

Requirements: Node.js 24+ ([`.nvmrc`](.nvmrc)) and pnpm (version pinned in `package.json`).

```bash
pnpm install
pnpm --filter @virgulimaginaria/storybook exec playwright install chromium   # once, for story tests
pnpm storybook
```

## Branch and change workflow

1. Branch from `main` (`feat/copy-button`, `fix/tooltip-focus`, ...).
2. Make the change, with stories and tests.
3. Add a changeset if a published package changed (`pnpm changeset`).
4. Run `pnpm check`.
5. Open a pull request; the template lists the checks. CI must pass before merging. Pull requests are squash-merged.

## Adding a component

First decide whether it belongs here (see the decision rule in the [README](README.md#where-applications-stand)): it must be generic, reusable and free of business concepts. Check Storybook for an existing component that already covers the need, possibly by composition.

### From the shadcn registry

Components are added to the **shared** `packages/ui` package, never to an application:

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component>
```

`packages/ui/components.json` is configured for the `base-nova` style (Base UI primitives) and the package's private import aliases (`#components`, `#lib`, `#hooks`). After adding:

1. **Review the generated file.** Replace raw shadcn variables such as `var(--secondary)` with the design-token names (`var(--color-secondary)`). If the CLI appended CSS variables to `src/styles/globals.css`, move them into `@virgulimaginaria/design-tokens` as semantic tokens.
2. **Type the API.** Export a `<Name>Props` type for each part and document the component with a JSDoc comment.
3. **Export it.** Add an explicit subpath to `exports` in `packages/ui/package.json`:

   ```json
   "./<name>": {
     "@virgulimaginaria/source": "./src/components/<name>.tsx",
     "types": "./dist/components/<name>.d.ts",
     "default": "./dist/components/<name>.js"
   }
   ```

   The `public-api` test fails if a component has no export.

4. **Check dependencies.** New runtime dependencies added by the CLI must be justified; move development-only ones to `devDependencies`.

### Custom components

Build them on Base UI primitives and existing components, following the same file layout and conventions as the shadcn components (`data-slot`, `cn()` for class merging, `cva` for variants).

## Writing stories

Stories live in `apps/storybook/src/components/<name>.stories.tsx` and import the component **through its public entry point** (`@virgulimaginaria/ui/<name>`), exactly as an application would.

Each component's stories must make it possible to understand, without reading the source:

- what the component does and when to use it (`parameters.docs.description.component`);
- its public props (generated from the TypeScript types);
- its states and variants (one story each: default, disabled, invalid, ...);
- its accessibility considerations, with a `play` function demonstrating keyboard interaction.

Do not build fake application screens. Use fictional, generic data.

## Writing tests

- **Unit tests** (`packages/ui/src/components/<name>.test.tsx`) use Vitest and Testing Library. Test public behaviour, the way a user or assistive technology perceives it: query by role and accessible name, interact with `userEvent`, assert on what is rendered. Do not test class names, internal state or implementation details.
- **Story tests** run automatically: `pnpm test` renders every story in Chromium, runs its `play` function and audits it with axe. Accessibility violations fail the build.

## Accessibility expectations

See [docs/contributing-components.md](docs/contributing-components.md#accessibility). In short: full keyboard operability, visible focus, correct native semantics or ARIA, respected disabled states, meaningful accessible names, WCAG AA contrast and targets of at least 24×24px.

## Changesets and releases

Any change to `@virgulimaginaria/ui` or `@virgulimaginaria/design-tokens` needs a changeset:

```bash
pnpm changeset
```

| Bump      | When                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------- |
| **major** | Breaking public API change: removed or renamed export, prop, variant or token; changed default. |
| **minor** | New component, prop, variant or token.                                                          |
| **patch** | Bug fix or internal change without API impact.                                                  |

After merge, the Release workflow maintains a "Version Packages" pull request. Merging it publishes the new versions to GitHub Packages and updates the changelogs. Nobody publishes by hand.

## Validating locally

```bash
pnpm check
```

runs, in order: `format:check`, `lint`, `typecheck`, `test`, `build`, `build-storybook`. It is what CI runs.

## Public repository safety checks

Before every commit, review `git diff` for:

- secrets, tokens, credentials, `.env` files;
- internal URLs, hostnames, environment or infrastructure details;
- real names, identifiers (NIF, IBAN, emails, phone numbers) or records of real people;
- business rules, internal permissions or private documents;
- logos, restricted fonts, illustrations or other brand files.

If something private was committed, do not just delete it in a new commit: the history is public. Report it privately (see [SECURITY.md](SECURITY.md)) so it can be rotated and removed.

## Component completion checklist

```text
[ ] component is generic/domain-agnostic
[ ] no existing component already provides the capability
[ ] public API defined (exported Props types, JSDoc)
[ ] exported correctly (explicit subpath in packages/ui/package.json)
[ ] Storybook story added (purpose, when to use, states, variants, accessibility)
[ ] tests added (public behaviour)
[ ] keyboard behaviour checked
[ ] accessibility checked (story tests pass axe)
[ ] no brand/private assets
[ ] no internal data/configuration
[ ] changeset added when applicable
```
