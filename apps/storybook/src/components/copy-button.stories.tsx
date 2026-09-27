import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, spyOn, waitFor } from "storybook/test"

import { CopyButton } from "@virgulimaginaria/ui/copy-button"

/** Stubs the Clipboard API for a story's interactions. */
function stubClipboard() {
  return spyOn(navigator.clipboard, "writeText").mockResolvedValue()
}

const meta = {
  title: "Clipboard/CopyButton",
  component: CopyButton,
  args: {
    value: "509123456",
    onCopy: fn(),
    onCopyError: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["ghost", "outline", "secondary", "default"],
    },
    size: {
      control: "select",
      options: ["icon-xs", "icon-sm", "icon", "icon-lg"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Icon-only button that copies \`value\` to the clipboard, then briefly shows a check mark. It is the Design System's single copy action: \`CopyableText\` and \`CopyableInput\` are built on it.

\`\`\`tsx
import { CopyButton } from "@virgulimaginaria/ui/copy-button"

<CopyButton value="509123456" />
<CopyButton value="509123456" copyLabel="Copiar" copiedLabel="Copiado" errorLabel="Não foi possível copiar" />
\`\`\`

**When to use.** Next to a value people often need elsewhere, so they do not have to select it by hand (hard on touch screens, where selecting competes with scrolling). To show a value with its copy action, prefer \`CopyableText\` or \`CopyableInput\`.

**Behaviour.** Uses the asynchronous Clipboard API (\`navigator.clipboard.writeText\`), available in secure contexts (HTTPS, localhost). States: \`idle\` → \`copying\` → \`copied\` or \`error\` → back to \`idle\` after \`resetDelay\` (2 s by default), exposed as \`data-copy-state\`. Failures never throw: they show an alert icon, announce \`errorLabel\` and call \`onCopyError\`.

**Accessibility**

- A native \`<button>\` (via \`Button\`): <kbd>Enter</kbd> and <kbd>Space</kbd> copy, with a visible focus ring.
- Its accessible name is \`copyLabel\` ("Copy"); make it specific ("Copy reference") when several copy buttons share a view.
- The outcome ("Copied", "Copy failed") is announced through a polite live region (\`role="status"\`) and shown in the tooltip; neither depends on hovering, and no toast or dialog is used.
- 28×28px by default (above the WCAG 2.2 minimum of 24×24px); on touch devices the hit area grows to at least 44×44px without changing its visual size.
`,
      },
    },
  },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Copied: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Clicking copies `value` and swaps the copy icon for a check mark; screen readers hear “Copied”.",
      },
    },
  },
  play: async ({ canvas, args, userEvent }) => {
    const writeText = stubClipboard()
    const button = canvas.getByRole("button", { name: "Copy" })

    await userEvent.click(button)

    await expect(writeText).toHaveBeenCalledWith("509123456")
    await waitFor(() =>
      expect(button).toHaveAttribute("data-copy-state", "copied")
    )
    await expect(canvas.getByRole("status")).toHaveTextContent("Copied")
    await expect(args.onCopy).toHaveBeenCalledWith("509123456")
  },
}

export const KeyboardInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Press <kbd>Tab</kbd> to focus the button, then <kbd>Enter</kbd> or <kbd>Space</kbd> to copy.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const writeText = stubClipboard()

    await userEvent.tab()
    const button = canvas.getByRole("button", { name: "Copy" })
    await expect(button).toHaveFocus()
    await userEvent.keyboard("{Enter}")

    await expect(writeText).toHaveBeenCalledWith("509123456")
    await waitFor(() =>
      expect(button).toHaveAttribute("data-copy-state", "copied")
    )
  },
}

export const ClipboardFailure: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Here the clipboard refuses the write (for example, permission denied): the button shows an alert icon and announces “Copy failed”, without throwing.",
      },
    },
  },
  beforeEach: () => {
    const writeText = spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new DOMException("Write permission denied.", "NotAllowedError")
    )
    return () => writeText.mockRestore()
  },
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Copy" })

    await userEvent.click(button)

    await waitFor(() =>
      expect(button).toHaveAttribute("data-copy-state", "error")
    )
    await expect(canvas.getByRole("status")).toHaveTextContent("Copy failed")
    await expect(args.onCopyError).toHaveBeenCalledOnce()
  },
}

export const CustomLabels: Story = {
  args: {
    copyLabel: "Copiar",
    copiedLabel: "Copiado",
    errorLabel: "Não foi possível copiar",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Labels are plain props, so applications translate them without an i18n dependency in the Design System.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    stubClipboard()
    await userEvent.click(canvas.getByRole("button", { name: "Copiar" }))
    await expect(canvas.getByRole("status")).toHaveTextContent("Copiado")
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Copy" })).toBeDisabled()
  },
}
