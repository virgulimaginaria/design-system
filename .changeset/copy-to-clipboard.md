---
"@virgulimaginaria/ui": minor
---

Add copy-to-clipboard components: `CopyButton` (`@virgulimaginaria/ui/copy-button`), `CopyableText` (`@virgulimaginaria/ui/copyable-text`) and `CopyableInput` (`@virgulimaginaria/ui/copyable-input`). They share one internal implementation on the asynchronous Clipboard API, confirm a copy visually and through a polite live region, report failures without throwing, and keep the displayed value separate from the copied one: `value` is shown, the optional `copyValue` is copied (defaulting to `value`). `CopyableInput` forwards `className` to its `<input>` and styles its container through `containerClassName`. Adds `lucide-react` as a dependency for their icons.
