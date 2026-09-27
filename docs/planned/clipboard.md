# Planned: clipboard / copy interactions

**Status:** planned, not implemented. This page records the intended design so the implementation stays consistent.

Many interfaces need to let people copy a value (a name, a tax number, a bank account number, an identifier) with one action. The Design System will provide this once, for every application.

## Model

```text
useCopyToClipboard      (packages/ui/src/hooks/use-copy-to-clipboard.ts)
        ↓
CopyButton              (packages/ui/src/components/copy-button.tsx)
        ↓
├── CopyableText        value displayed as text, with a CopyButton
└── CopyableInput       value in a read-only Input, with a CopyButton
```

There is **one** clipboard implementation: the hook. `CopyButton` is the only component that calls it; `CopyableText` and `CopyableInput` compose `CopyButton`. None of them re-implements copying.

## Displayed versus copied value

What people see and what is copied can differ, for example grouped digits for readability but the raw value on the clipboard:

```tsx
<CopyableText value="509123456" displayValue="509 123 456" />
```

- `value` is always what is copied.
- `displayValue` (optional) is what is rendered; it defaults to `value`.
- Formatting rules (how to group a tax number or an account number) are **not** part of the Design System: applications compute `displayValue`.

## Expected behaviour

- Copy through the asynchronous Clipboard API, with a clear failure state when it is unavailable or denied.
- Short-lived "Copied" feedback, visible and announced to screen readers through a polite live region.
- `CopyButton` is a `Button` (icon-only by default, so it requires an accessible name such as "Copy") with a `Tooltip`.
- Callbacks for applications that need them (`onCopy`, `onCopyError`), without logging or analytics built in.

## Out of scope

- Domain-specific components (`NifCopy`, `IbanField`): they belong in applications, composed from these.
- Validation or formatting of any identifier.
