import * as React from "react"
import { cn } from "cn"

import { CopyButton, type CopyButtonProps } from "#components/copy-button"
import { Input, type InputProps } from "#components/input"

type CopyableInputProps = InputProps &
  Pick<
    CopyButtonProps,
    | "copyLabel"
    | "copiedLabel"
    | "errorLabel"
    | "resetDelay"
    | "onCopy"
    | "onCopyError"
  > & {
    /**
     * The exact text written to the clipboard. Defaults to the field's
     * current value; set it when the field shows a formatted form.
     */
    copyValue?: string
  }

function toText(value: InputProps["value"]) {
  return value === undefined ? "" : String(value)
}

/**
 * An `Input` with a trailing `CopyButton`. Every `Input` prop is forwarded
 * to the `<input>` (label it as usual, with `id` + `<label>` or
 * `aria-label`); `className` styles the field's outer box.
 *
 * - Copies `copyValue`, or the field's current value when it is not set.
 * - Use `readOnly` for values people read and copy but must not change.
 * - `disabled` disables the field and the copy action together.
 */
function CopyableInput({
  copyValue,
  copyLabel,
  copiedLabel,
  errorLabel,
  resetDelay,
  onCopy,
  onCopyError,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  ...props
}: CopyableInputProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    toText(defaultValue)
  )
  const currentValue = value === undefined ? uncontrolledValue : toText(value)

  return (
    <div
      data-slot="copyable-input"
      className={cn(
        "flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-input/50 has-[input:disabled]:opacity-50 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50 has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-destructive/20 dark:bg-input/30 dark:has-[input:disabled]:bg-input/80 dark:has-[input[aria-invalid=true]]:border-destructive/50 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
        className
      )}
    >
      <Input
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.target.value)
          onChange?.(event)
        }}
        className="h-full flex-1 rounded-none border-0 bg-transparent ring-0 focus-visible:ring-0 disabled:bg-transparent disabled:opacity-100 aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent"
        {...props}
      />
      <CopyButton
        value={copyValue ?? currentValue}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        errorLabel={errorLabel}
        resetDelay={resetDelay}
        onCopy={onCopy}
        onCopyError={onCopyError}
        disabled={disabled}
        className="mr-0.5 disabled:opacity-100"
      />
    </div>
  )
}

export { CopyableInput, type CopyableInputProps }
