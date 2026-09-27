import * as React from "react"
import { CheckIcon, CircleAlertIcon, CopyIcon } from "lucide-react"
import { cn } from "cn"

import { Button, type ButtonProps } from "#components/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/tooltip"
import {
  useCopyToClipboard,
  type UseCopyToClipboardOptions,
} from "#hooks/use-copy-to-clipboard"

type CopyButtonProps = Omit<ButtonProps, "value" | "children"> &
  UseCopyToClipboardOptions & {
    /** The exact text written to the clipboard. */
    value: string
    /**
     * Accessible name of the button, also shown in its tooltip. Make it
     * specific ("Copy reference") when several copy buttons share a view.
     * @default "Copy"
     */
    copyLabel?: string
    /**
     * Shown in the tooltip and announced after a successful copy.
     * @default "Copied"
     */
    copiedLabel?: string
    /**
     * Shown in the tooltip and announced when the value could not be copied.
     * @default "Copy failed"
     */
    errorLabel?: string
  }

const icons = {
  idle: CopyIcon,
  copying: CopyIcon,
  copied: CheckIcon,
  error: CircleAlertIcon,
}

/**
 * Icon-only button that copies `value` to the clipboard, then briefly shows a
 * check mark (or an alert icon if copying failed).
 *
 * - The accessible name is `copyLabel` ("Copy"); the outcome ("Copied",
 *   "Copy failed") is announced through a polite live region and shown in the
 *   tooltip, so it never depends on hovering.
 * - The current state is exposed as `data-copy-state` (`idle`, `copying`,
 *   `copied`, `error`) for styling.
 * - On touch devices the hit area grows to at least 44×44px without changing
 *   the visual size.
 */
function CopyButton({
  value,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  errorLabel = "Copy failed",
  resetDelay,
  onCopy,
  onCopyError,
  onClick,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: CopyButtonProps) {
  const { status, copy } = useCopyToClipboard({
    resetDelay,
    onCopy,
    onCopyError,
  })
  const Icon = icons[status]
  const announcement =
    status === "copied" ? copiedLabel : status === "error" ? errorLabel : ""

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          closeOnClick={false}
          render={
            <Button
              data-slot="copy-button"
              data-copy-state={status}
              variant={variant}
              size={size}
              aria-label={copyLabel}
              className={cn(
                "relative data-[copy-state=error]:text-destructive pointer-coarse:after:absolute pointer-coarse:after:-inset-2",
                className
              )}
              onClick={(event) => {
                onClick?.(event)
                if (!event.defaultPrevented) void copy(value)
              }}
              {...props}
            />
          }
        >
          <Icon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>{announcement || copyLabel}</TooltipContent>
      </Tooltip>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </>
  )
}

export { CopyButton, type CopyButtonProps }
