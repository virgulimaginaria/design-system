import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, spyOn, waitFor } from "storybook/test"

import { CopyableText } from "@virgulimaginaria/ui/copyable-text"

const meta = {
  title: "Clipboard/CopyableText",
  component: CopyableText,
  args: {
    value: "REF-2031-0042",
  },
  parameters: {
    docs: {
      description: {
        component: `
A displayed value with a \`CopyButton\` beside it, so it can be copied in one action instead of being selected by hand.

\`\`\`tsx
import { CopyableText } from "@virgulimaginaria/ui/copyable-text"

<CopyableText value="509123456" displayValue="509 123 456" />
\`\`\`

**Display and clipboard are separate.** \`displayValue\` is what people read; \`value\` is exactly what the clipboard receives. Applications format the display (grouping digits, for example); the Design System never formats or validates values. \`displayValue\` is optional and defaults to \`value\`.

**When to use.** Read-only values in text: details, summaries, table cells. For a value inside a form, use \`CopyableInput\`.

**Accessibility**

- The text stays selectable as usual; the button is an extra way to copy, not a replacement.
- The copy button is described by the displayed text (\`aria-describedby\`), so assistive technology announces which value it copies. Set \`copyLabel\` when several copy buttons share a view.
- Long values wrap at any character rather than overflowing or being truncated.
- \`disabled\` disables only the copy action; the text stays readable.
`,
      },
    },
  },
} satisfies Meta<typeof CopyableText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FormattedDisplayValue: Story = {
  args: {
    value: "509123456",
    displayValue: "509 123 456",
  },
  parameters: {
    docs: {
      description: {
        story:
          "People read `509 123 456`; the clipboard receives `509123456`. Also works from the keyboard: <kbd>Tab</kbd> to the button, <kbd>Enter</kbd> to copy.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const writeText = spyOn(
      navigator.clipboard,
      "writeText"
    ).mockResolvedValue()
    await expect(canvas.getByText("509 123 456")).toBeVisible()
    await expect(canvas.queryByText("509123456")).not.toBeInTheDocument()

    const button = canvas.getByRole("button", { name: "Copy" })
    await expect(button).toHaveAccessibleDescription("509 123 456")
    await userEvent.click(button)

    await expect(writeText).toHaveBeenLastCalledWith("509123456")
    await waitFor(() =>
      expect(button).toHaveAttribute("data-copy-state", "copied")
    )

    writeText.mockClear()
    await userEvent.tab()
    await userEvent.tab({ shift: true })
    await expect(button).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(writeText).toHaveBeenCalledOnce()
    await expect(writeText).toHaveBeenCalledWith("509123456")
  },
}

export const LongValue: Story = {
  args: {
    value: "c3VwZXJjYWxpZnJhZ2lsaXN0aWNleHBpYWxpZG9jaW91cy0wMDAx",
  },
  render: (args) => (
    <div className="w-64">
      <CopyableText {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A long value wraps inside its container; the copy button stays next to it.",
      },
    },
  },
}

export const TypicalIdentifier: Story = {
  args: {
    value: "PT50000000000000000000000",
    displayValue: "PT50 0000 0000 0000 0000 0000 0",
    copyLabel: "Copy account number",
  },
  render: (args) => (
    <dl className="grid w-80 gap-1 text-sm">
      <dt className="text-muted-foreground">Account number</dt>
      <dd>
        <CopyableText {...args} className="font-mono" />
      </dd>
    </dl>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "A formatted identifier in a description list, with a specific `copyLabel`. What the value means is up to the application.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const writeText = spyOn(
      navigator.clipboard,
      "writeText"
    ).mockResolvedValue()
    await userEvent.click(
      canvas.getByRole("button", { name: "Copy account number" })
    )
    await expect(writeText).toHaveBeenCalledWith("PT50000000000000000000000")
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Copy" })).toBeDisabled()
    await expect(canvas.getByText("REF-2031-0042")).toBeVisible()
  },
}
