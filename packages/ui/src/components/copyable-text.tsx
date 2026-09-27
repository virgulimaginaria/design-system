import * as React from "react"
import { cn } from "cn"

import { CopyButton, type CopyButtonProps } from "#components/copy-button"

type CopyableTextProps = Omit<React.ComponentProps<"span">, "children"> &
  Pick<
    CopyButtonProps,
    | "copyLabel"
    | "copiedLabel"
    | "errorLabel"
    | "resetDelay"
    | "onCopy"
    | "onCopyError"
  > & {
    /** The text shown. Copied as is unless `copyValue` is set. */
    value: string
    /**
     * The exact text written to the clipboard. Defaults to `value`; set it
     * when `value` is a human-readable form (grouped digits, for example) of
     * a canonical value.
     */
    copyValue?: string
    /** Disables the copy action. The text stays readable and selectable. */
    disabled?: boolean
  }

/**
 * A displayed value followed by a `CopyButton`, so it can be copied without
 * selecting the text first.
 *
 * `value` is what people read; `copyValue` (defaulting to `value`) is what
 * the clipboard receives. The text remains selectable as usual, and the copy button is described by
 * it, so assistive technology announces which value it copies.
 */
function CopyableText({
  value,
  copyValue,
  copyLabel,
  copiedLabel,
  errorLabel,
  resetDelay,
  onCopy,
  onCopyError,
  disabled,
  className,
  ...props
}: CopyableTextProps) {
  const textId = React.useId()
  return (
    <span
      data-slot="copyable-text"
      className={cn("inline-flex max-w-full items-center gap-1", className)}
      {...props}
    >
      <span id={textId} className="min-w-0 wrap-anywhere">
        {value}
      </span>
      <CopyButton
        value={copyValue ?? value}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        errorLabel={errorLabel}
        resetDelay={resetDelay}
        onCopy={onCopy}
        onCopyError={onCopyError}
        disabled={disabled}
        aria-describedby={textId}
      />
    </span>
  )
}

export { CopyableText, type CopyableTextProps }
