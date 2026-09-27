# Clipboard / copy interactions

Many interfaces need to let people copy a value (a name, a tax number, a bank account number, a reference) with one action instead of selecting it by hand, which is awkward with a mouse and unreliable on touch screens, where selecting text competes with scrolling and swiping. The Design System provides this once, for every application.

## Components

| Entry point                           | Use it for                                                     |
| ------------------------------------- | -------------------------------------------------------------- |
| `@virgulimaginaria/ui/copy-button`    | The copy action on its own: an icon-only `Button`.             |
| `@virgulimaginaria/ui/copyable-text`  | A value displayed as text, followed by a `CopyButton`.         |
| `@virgulimaginaria/ui/copyable-input` | An `Input` with a `CopyButton` as a trailing action inside it. |

```tsx
import { CopyButton } from "@virgulimaginaria/ui/copy-button"
import { CopyableInput } from "@virgulimaginaria/ui/copyable-input"
import { CopyableText } from "@virgulimaginaria/ui/copyable-text"

<CopyButton value="509123456" />
<CopyableText value="509 123 456" copyValue="509123456" />
<CopyableInput
  value="PT50 0000 0000 0000 0000 0000 0"
  copyValue="PT50000000000000000000000"
  readOnly
/>
```

Props, states and accessibility notes are documented in Storybook, under **Clipboard**.

## Architecture

```text
useCopyToClipboard      packages/ui/src/hooks/use-copy-to-clipboard.ts   (internal)
        ↓
CopyButton              packages/ui/src/components/copy-button.tsx
        ↓
├── CopyableText        packages/ui/src/components/copyable-text.tsx
└── CopyableInput       packages/ui/src/components/copyable-input.tsx
```

There is **one** clipboard implementation: the hook. `CopyButton` is the only component that calls it; `CopyableText` and `CopyableInput` compose `CopyButton` (and `CopyableInput` composes the existing `Input`). None of them re-implements copying.

The hook is **internal**: it is reachable only through the package's private `#hooks/*` import and is not part of the public API. It will be exported only if an application shows a concrete need that the components cannot meet.

## Display representation and clipboard representation are separate concerns

What people read and what is copied can differ: grouped digits are easier to read and check, but the value pasted elsewhere should be the canonical one.

```text
visible     509 123 456
clipboard   509123456
```

`CopyableText` and `CopyableInput` use the same two props:

| Prop        | Meaning                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`     | What the component shows (the text, or the input's value).                                                                                         |
| `copyValue` | Optional. What the clipboard receives. Defaults to `value` (for an editable `CopyableInput`, the field's current value, including what was typed). |

`CopyButton` shows no value, so its `value` is simply what it copies.

Formatting rules (how to group a tax number or an account number) are **not** part of the Design System: applications compute the display form. The Design System never validates or formats identifiers.

## Behaviour

- Copies through the asynchronous Clipboard API, `navigator.clipboard.writeText`. Browsers provide it only in secure contexts (HTTPS or `localhost`). The deprecated `document.execCommand("copy")` is not used.
- States, exposed on the button as `data-copy-state`:

  ```text
  idle ──click──▶ copying ──▶ copied ──(resetDelay)──▶ idle
                          └─▶ error  ──(resetDelay)──▶ idle
  ```

  `resetDelay` defaults to 2000 ms. A new copy restarts it; when attempts overlap, only the latest one updates the state.

- Failures never throw. An unavailable API or a refused write (for example, permission denied) moves to `error`: the icon becomes an alert, "Copy failed" is announced and `onCopyError(reason)` is called.
- `onCopy(value)` is called after a successful copy. No logging or analytics are built in.
- An `onClick` handler on `CopyButton` runs first and can cancel the copy with `event.preventDefault()`.

## Styling

Every component merges `className` with `cn()`, so consumer classes win. `CopyableText` applies it to its root. `CopyableInput` forwards `className` to the `<input>`, like every other `Input` prop, and styles the field's box (the container holding the input and the trailing copy action) with `containerClassName`.

## Accessibility

- `CopyButton` is a native `<button>` (the Design System `Button`, `ghost` variant, `icon-sm` size): keyboard operable with <kbd>Enter</kbd> and <kbd>Space</kbd>, with a visible focus ring.
- **Stable accessible name.** The name is `copyLabel` ("Copy") in every state. The outcome is announced through a polite live region (`role="status"`, visually hidden) that is always rendered, so screen readers hear "Copied" or "Copy failed" without the button's name changing under focus.
- **The tooltip is supplementary.** It repeats the label and the outcome for pointer users; nothing depends on it, since tooltips are unavailable on touch devices.
- **No disruptive feedback**: no alerts, dialogs, browser notifications or toasts.
- **Visible confirmation**: the copy icon becomes a check mark (or an alert icon on failure) for `resetDelay`.
- **Target size**: 28×28px by default (above the WCAG 2.2 minimum of 24×24px); on coarse pointers (touch) an invisible extension grows the hit area to 44×44px without changing the layout.
- **Which value?** `CopyableText` describes its button with the displayed text (`aria-describedby`). When several copy buttons share a view, give each a specific `copyLabel` ("Copy reference").
- **Selection still works.** Text is never made unselectable: the copy action is an addition to standard browser behaviour, not a replacement.
- **Disabled**: `CopyableText` `disabled` disables only the copy action. `CopyableInput` `disabled` disables the field and the copy action together; use `readOnly` for values people read and copy but must not change.
- Labels are plain props (`copyLabel`, `copiedLabel`, `errorLabel`), so applications translate them without an i18n dependency in the Design System.

## Testing

- Unit tests (`packages/ui`) stub `navigator.clipboard` (`src/test/clipboard.ts`) and use fake timers for the reset delay.
- Story tests (`apps/storybook`) spy on `navigator.clipboard.writeText` and prove, in a real browser, that the canonical value reaches the clipboard (`509 123 456` displayed, `509123456` copied), that the state becomes `copied`, that failures become `error`, and that the keyboard works. Every story passes the axe audit.

## Out of scope

- **Domain components** (`NifField`, `IbanField`, ...): they belong in applications, composed from these.
- **Validation or formatting** of any identifier.

## Copy actions in option-like components (not implemented)

A copy button inside a native `<option>` is not possible: native options cannot contain interactive content, and browsers render them outside the page. A `CopyableOption` component will not be added until the actual need is clear. Depending on what is needed:

| Need                                       | Proposed composition                                                                                                                                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Copy the **selected** value of a select    | A `CopyButton` next to the select trigger (outside it), copying the selected item's canonical value. No new component.                                                                       |
| Copy a value from a **list row**           | A row containing `CopyableText`, or the row's text plus a `CopyButton`. The row must not itself be a button, to avoid nested interactive elements.                                           |
| Copy from a **menu**                       | A dedicated menu item ("Copy reference") whose action copies the value; Base UI's `Menu.Item` gives the keyboard and focus behaviour. Requires a `Menu` component, which does not exist yet. |
| Copy **each item** of a select or combobox | Not recommended: a second interactive target inside a Base UI `Select.Item` breaks its single-action, roving-focus model. Prefer copying the selected value, or a list instead of a select.  |

Whichever is needed, it must reuse `CopyButton` (or the internal hook) rather than calling the Clipboard API again.
