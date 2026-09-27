---
"@virgulimaginaria/ui": minor
---

Add copy-to-clipboard components: `CopyButton` (`@virgulimaginaria/ui/copy-button`), `CopyableText` (`@virgulimaginaria/ui/copyable-text`) and `CopyableInput` (`@virgulimaginaria/ui/copyable-input`). They share one internal implementation on the asynchronous Clipboard API, confirm a copy visually and through a polite live region, report failures without throwing, and keep the displayed value separate from the copied one (`displayValue` / `copyValue`). Adds `lucide-react` as a dependency for their icons.
