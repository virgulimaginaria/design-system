# Contributing components

How to design, build and document a component for the Design System. The step-by-step workflow (shadcn CLI, exports, changesets) is in [CONTRIBUTING.md](../CONTRIBUTING.md#adding-a-component).

## Does it belong here?

A component belongs in the Design System when it is:

- **generic**: useful to more than one application, described in interface terms ("copyable text"), not business terms ("student NIF");
- **reusable** without modification: variation is expressed through props, variants and composition;
- **free of business rules**: no validation, formatting or permissions specific to a domain.

Otherwise it stays in the application, composed from Design System components.

Before adding anything, check whether an existing component already does it, possibly by composition. For example, an icon-only action is a `Button` with `size="icon"` and an `aria-label`, not a new component.

## API design

- **Name by role, not by use**: `Tooltip`, `CopyButton`, never `AccountTooltip`.
- **Stay close to the platform and Base UI**: forward native attributes and Base UI props (`...props`); do not rename them.
- **Composition first**: expose parts (`Tooltip`, `TooltipTrigger`, `TooltipContent`) and support Base UI's `render` prop rather than adding a prop for every variation.
- **Variants with `cva`**, named semantically (`default`, `secondary`, `destructive`), never by colour.
- **Style overrides** through `className`, merged with `cn()` so consumer classes win.
- **Export a `<Name>Props` type** for every public part, and document the component with JSDoc (it becomes the Storybook description).
- **One behaviour, one implementation**: share logic through a hook in `src/hooks/` instead of re-implementing it per component.

## Accessibility

Accessibility is a requirement for every component, not an enhancement. Each component must provide:

| Area             | Expectation                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Keyboard         | Every interaction works with the keyboard alone, with the expected keys (Enter/Space for buttons, Escape to dismiss, arrows inside composite widgets).             |
| Visible focus    | A clearly visible focus indicator (`focus-visible` ring using `--color-ring`); never remove outlines without a replacement.                                        |
| Semantics        | Native elements first (`<button>`, `<input>`, `<label>`); ARIA only where native semantics are not enough. Base UI provides the ARIA wiring for composite widgets. |
| Accessible names | Every control has a name: visible label, `aria-label` for icon-only controls, `aria-describedby` for hints and errors.                                             |
| Disabled states  | Disabled controls are not operable and are announced as such; use `focusableWhenDisabled` when they must stay discoverable.                                        |
| Screen readers   | State changes that matter (errors, "Copied") are announced, e.g. through a live region.                                                                            |
| Contrast         | WCAG AA: 4.5:1 for text, 3:1 for UI boundaries and focus indicators, in light and dark schemes.                                                                    |
| Touch targets    | At least 24×24px (WCAG 2.2 AA); prefer 44×44px for primary touch interactions.                                                                                     |
| Motion           | Non-essential animation respects `prefers-reduced-motion`.                                                                                                         |

How it is verified:

- Every story is audited with axe during `pnpm test` (`a11y.test: "error"`), locally and in CI. A violation fails the build.
- Stories include a `play` function that exercises the keyboard interaction.
- Unit tests query by role and accessible name, which fails when semantics are wrong.
- Automated checks do not catch everything: also test manually with the keyboard and, for new interaction patterns, a screen reader.

## Documentation

Each component's Storybook page must answer: what it does, when to use it (and when not), its props, its states and variants, and its accessibility considerations. See [Writing stories](../CONTRIBUTING.md#writing-stories).

## Data in examples

Stories, tests and docs use fictional, generic data only. Never real names, identifiers, addresses or records, and never real screens of an application.
