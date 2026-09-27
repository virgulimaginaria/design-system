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
    /** The exact text written to the clipboard. */
    value: string
    /**
     * What is shown. Defaults to `value`. Use it for a human-readable form
     * (grouped digits, for example) while `value` stays canonical.
     */
    displayValue?: React.ReactNode
    /** Disables the copy action. The text stays readable and selectable. */
    disabled?: boolean
  }

/**
 * A displayed value followed by a `CopyButton`, so it can be copied without
 * selecting the text first.
 *
 * `displayValue` is what people read; `value` is what the clipboard receives.
 * The text remains selectable as usual, and the copy button is described by
 * it, so assistive technology announces which value it copies.
 */
function CopyableText({
  value,
  displayValue,
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
        {displayValue ?? value}
      </span>
      <CopyButton
        value={value}
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
