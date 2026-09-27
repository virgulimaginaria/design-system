import * as React from "react"

/**
 * Where a copy attempt stands:
 *
 * - `idle`: nothing to report; ready to copy.
 * - `copying`: waiting for the Clipboard API to settle.
 * - `copied`: the value is on the clipboard (resets to `idle` after
 *   `resetDelay`).
 * - `error`: the Clipboard API is unavailable or refused the write (resets to
 *   `idle` after `resetDelay`).
 */
type CopyStatus = "idle" | "copying" | "copied" | "error"

/** How long the `copied` and `error` states last, in milliseconds. */
const DEFAULT_RESET_DELAY = 2000

type UseCopyToClipboardOptions = {
  /**
   * Milliseconds before `copied` or `error` returns to `idle`.
   * @default 2000
   */
  resetDelay?: number
  /** Called with the copied value after a successful write. */
  onCopy?: (value: string) => void
  /** Called with the reason when the value could not be copied. */
  onCopyError?: (error: unknown) => void
}

type UseCopyToClipboardResult = {
  status: CopyStatus
  /**
   * Writes `value` to the clipboard. Never rejects: resolves to `true` on
   * success and `false` on failure (the failure is reflected in `status`).
   */
  copy: (value: string) => Promise<boolean>
}

/**
 * The Design System's single clipboard implementation, shared by every copy
 * component. Internal: applications use `CopyButton`, `CopyableText` or
 * `CopyableInput` instead.
 *
 * Uses the asynchronous Clipboard API (`navigator.clipboard.writeText`), which
 * browsers only provide in secure contexts (HTTPS or localhost).
 */
function useCopyToClipboard({
  resetDelay = DEFAULT_RESET_DELAY,
  onCopy,
  onCopyError,
}: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
  const [status, setStatus] = React.useState<CopyStatus>("idle")
  const resetTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  // Only the latest attempt may update the status, so a slow earlier write
  // never overrides the outcome of a later one.
  const attempt = React.useRef(0)
  const callbacks = React.useRef({ onCopy, onCopyError })

  React.useEffect(() => {
    callbacks.current = { onCopy, onCopyError }
  })

  React.useEffect(() => () => clearTimeout(resetTimer.current), [])

  const copy = React.useCallback(
    async (value: string) => {
      const current = ++attempt.current
      clearTimeout(resetTimer.current)
      setStatus("copying")

      let succeeded: boolean
      let failure: unknown
      try {
        if (typeof navigator === "undefined" || !navigator.clipboard) {
          throw new Error("The Clipboard API is not available.")
        }
        await navigator.clipboard.writeText(value)
        succeeded = true
      } catch (error) {
        succeeded = false
        failure = error
      }

      if (current !== attempt.current) return succeeded

      setStatus(succeeded ? "copied" : "error")
      resetTimer.current = setTimeout(() => setStatus("idle"), resetDelay)
      if (succeeded) callbacks.current.onCopy?.(value)
      else callbacks.current.onCopyError?.(failure)
      return succeeded
    },
    [resetDelay]
  )

  return { status, copy }
}

export {
  DEFAULT_RESET_DELAY,
  useCopyToClipboard,
  type CopyStatus,
  type UseCopyToClipboardOptions,
  type UseCopyToClipboardResult,
}
