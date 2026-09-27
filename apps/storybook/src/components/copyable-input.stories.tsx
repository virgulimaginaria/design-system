import type { Meta, StoryObj } from "@storybook/react-vite"
import { useId } from "react"
import { expect, spyOn, waitFor } from "storybook/test"

import {
  CopyableInput,
  type CopyableInputProps,
} from "@virgulimaginaria/ui/copyable-input"

function Field({ label, ...props }: CopyableInputProps & { label: string }) {
  const id = useId()
  return (
    <div className="grid w-96 max-w-full gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <CopyableInput id={id} {...props} />
    </div>
  )
}

const meta = {
  title: "Clipboard/CopyableInput",
  component: CopyableInput,
  args: {
    defaultValue: "A-0042",
  },
  render: (args) => <Field label="Code" {...args} />,
  parameters: {
    docs: {
      description: {
        component: `
An \`Input\` with a trailing \`CopyButton\` inside the same field. It is the regular \`Input\`: every input prop (\`id\`, \`name\`, \`value\`, \`readOnly\`, \`aria-*\`, ...) is forwarded to the \`<input>\`, and \`className\` styles the field's box.

\`\`\`tsx
import { CopyableInput } from "@virgulimaginaria/ui/copyable-input"

<CopyableInput value="A-0042" readOnly />
<CopyableInput
  value="PT50 0000 0000 0000 0000 0000 0"
  copyValue="PT50000000000000000000000"
  readOnly
/>
\`\`\`

**What is copied.** \`copyValue\` when set, otherwise the field's current value (including what the user typed). As with \`CopyableText\`, display and clipboard are separate: formatting is the application's job.

**States.** \`readOnly\` for values people read and copy but must not change: the field stays focusable, selectable and copyable. \`disabled\` disables the field **and** the copy action, because a disabled value is presented as unavailable.

**Accessibility**

- Label the field as any input (a visible \`<label>\`); the copy button follows the field in the tab order and is named by \`copyLabel\` ("Copy").
- The copy outcome is announced through a polite live region.
- Invalid and focus states are shown on the whole field, as with \`Input\`.
`,
      },
    },
  },
} satisfies Meta<typeof CopyableInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const writeText = spyOn(
      navigator.clipboard,
      "writeText"
    ).mockResolvedValue()
    const input = canvas.getByRole("textbox", { name: "Code" })
    await userEvent.type(input, "-B")

    await userEvent.tab()
    const button = canvas.getByRole("button", { name: "Copy" })
    await expect(button).toHaveFocus()
    await userEvent.keyboard("{Enter}")

    await expect(writeText).toHaveBeenCalledWith("A-0042-B")
    await waitFor(() =>
      expect(button).toHaveAttribute("data-copy-state", "copied")
    )
  },
}

export const ReadOnly: Story = {
  args: { defaultValue: undefined, value: "A-0042", readOnly: true },
  play: async ({ canvas, userEvent }) => {
    const writeText = spyOn(
      navigator.clipboard,
      "writeText"
    ).mockResolvedValue()
    const input = canvas.getByRole("textbox", { name: "Code" })
    await expect(input).toHaveAttribute("readonly")

    await userEvent.click(canvas.getByRole("button", { name: "Copy" }))
    await expect(writeText).toHaveBeenCalledWith("A-0042")
  },
}

export const FormattedCopyValue: Story = {
  args: {
    defaultValue: undefined,
    value: "PT50 0000 0000 0000 0000 0000 0",
    copyValue: "PT50000000000000000000000",
    readOnly: true,
    className: "font-mono",
  },
  render: (args) => <Field label="Account number" {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "The field shows the grouped form; the clipboard receives `copyValue`.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const writeText = spyOn(
      navigator.clipboard,
      "writeText"
    ).mockResolvedValue()
    await expect(
      canvas.getByRole("textbox", { name: "Account number" })
    ).toHaveValue("PT50 0000 0000 0000 0000 0000 0")

    await userEvent.click(canvas.getByRole("button", { name: "Copy" }))

    await expect(writeText).toHaveBeenCalledOnce()
    await expect(writeText).toHaveBeenCalledWith("PT50000000000000000000000")
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Code" })).toBeDisabled()
    await expect(canvas.getByRole("button", { name: "Copy" })).toBeDisabled()
  },
}
