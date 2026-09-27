# AGENTS.md

Instructions for coding agents working in this repository. They are **mandatory**. Human contributors follow the same rules (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## What this repository is

The Primeira Academia Design System: a **public**, reusable, domain-agnostic UI foundation. It publishes two packages, `@virgulimaginaria/design-tokens` and `@virgulimaginaria/ui`, documented in the Storybook app under `apps/storybook`. Architecture: [docs/architecture.md](docs/architecture.md). Settled decisions: [docs/decisions/](docs/decisions/); do not reopen them without new evidence.

> Applications should not invent new UI primitives before checking whether the required capability exists in, or belongs in, the Design System.

## Mandatory rules

1. **This repository is public.**
2. **Assume every committed line is publicly visible**, forever, including git history.
3. **Never commit secrets, credentials, private URLs or real operational data.** That includes tokens, API keys, `.env` files, internal hostnames, environment or infrastructure details, and data about real customers, students or employees.
4. **Never add restricted brand assets**: logos, restricted illustrations, fonts that cannot be redistributed, private images. Expose tokens, CSS variables and slots so applications can brand themselves instead.
5. **Components must be domain-agnostic.** They describe interface behaviour, not business meaning.
6. **Before creating a new component, check whether an existing component already provides the required capability**, directly or by composition.
7. **Prefer composition over creating specialised primitives.** A `Button` with an icon and an `aria-label` is not a new component.
8. **Avoid duplicating behaviours.** One behaviour has one implementation (for example, a single clipboard hook shared by every copy component).
9. **Every public component requires**:
   - a TypeScript API (exported `...Props` types);
   - a public export (an explicit subpath in `packages/ui/package.json` `exports`);
   - a Storybook story and documentation (`apps/storybook/src/components/<name>.stories.tsx`);
   - tests (`packages/ui/src/components/<name>.test.tsx`);
   - accessibility consideration (keyboard, focus, semantics, contrast, target size; stories pass axe).
10. **Do not introduce application-specific concepts.** No Account, Student, Enrollment, Billing, Subscription, Payment, Administration, Operations or any other business entity, in code, names, props, tokens, stories or tests.
11. **Do not import from consuming applications**, and never make packages depend on Storybook or on anything under `apps/`.
12. **Do not expose internal implementation paths as public API.** No wildcard exports; internal modules are reached only through the package's private `#components/*`, `#hooks/*` and `#lib/*` imports.
13. **Breaking public API changes require a major Changeset** (`pnpm changeset`). Any change to a published package needs a changeset.
14. **Use fictional data in examples** ("Ada Lovelace", `name@example.com`, `PT50 0000 0000 0000 0000 0000 0`), never real people, identifiers or records.
15. **Keep dependencies intentional and minimal.** Justify each new runtime dependency; development tools stay in `devDependencies`.

## Where things go

| You are adding            | Put it in                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| A component               | `packages/ui/src/components/<name>.tsx` (via `pnpm dlx shadcn@latest add` when shadcn has it) |
| A reusable React hook     | `packages/ui/src/hooks/use-<name>.ts`                                                         |
| An internal helper        | `packages/ui/src/lib/`                                                                        |
| A token                   | `packages/design-tokens/src/` (semantic name, light and dark values)                          |
| A story or docs page      | `apps/storybook/src/`                                                                         |
| An architectural decision | `docs/decisions/NNNN-<title>.md`                                                              |

Do not create new packages without a concrete need (see ADR 0001).

## Commands

```bash
pnpm install
pnpm storybook        # develop
pnpm check            # must pass before you finish: format, lint, typecheck, test, build, build-storybook
pnpm changeset        # describe changes to published packages
```

Running a single package: `pnpm --filter @virgulimaginaria/ui test`.

## Before you finish

- `pnpm check` passes.
- The component checklist in [CONTRIBUTING.md](CONTRIBUTING.md#component-completion-checklist) is satisfied.
- `git diff` contains nothing private: no secrets, internal URLs, real data or brand files.
- A changeset exists for every changed published package.
