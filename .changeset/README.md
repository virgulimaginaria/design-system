# Changesets

Every change to a published package (`@virgulimaginaria/ui`,
`@virgulimaginaria/design-tokens`) needs a changeset. Run:

```bash
pnpm changeset
```

pick the affected packages and the semver bump, and commit the generated file
with your change.

- **major**: breaking change to a public API (removed/renamed export, prop,
  variant or token; changed default behaviour).
- **minor**: new component, prop, variant or token.
- **patch**: bug fix or internal change with no API impact.

Changes to Storybook, documentation or tooling only do not need a changeset.

See [CONTRIBUTING.md](../CONTRIBUTING.md#changesets-and-releases).
