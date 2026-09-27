import type { Meta, StoryObj } from "@storybook/react-vite"
import { useId } from "react"
import { expect } from "storybook/test"

import { Input, type InputProps } from "@virgulimaginaria/ui/input"

function Field({
  label,
  error,
  ...props
}: InputProps & { label: string; error?: string }) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="grid w-72 gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "Ada Lovelace",
  },
  render: (args) => <Field label="Full name" {...args} />,
  parameters: {
    docs: {
      description: {
        component: `
Single-line text field. Built on the Base UI \`Input\`, so it renders a native \`<input>\` and accepts every native input attribute.

\`\`\`tsx
import { Input } from "@virgulimaginaria/ui/input"
\`\`\`

**When to use.** Short free-form values: names, codes, search terms, email addresses. Choose the \`type\` that matches the value (\`email\`, \`tel\`, \`search\`, ...) so mobile keyboards and autofill help the user.

**Accessibility**

- Every input needs a visible \`<label>\` linked with \`htmlFor\`/\`id\`. A placeholder is not a label.
- Invalid values: set \`aria-invalid\` and point \`aria-describedby\` at the error message. The field turns to the danger colour, but the message text is what communicates the error.
- \`disabled\` fields are skipped by the keyboard and are not submitted; use \`readOnly\` for values users must still read and copy.
`,
      },
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Full name" })
    await userEvent.type(input, "Grace Hopper")
    await expect(input).toHaveValue("Grace Hopper")
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Not editable" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox")).toBeDisabled()
  },
}

export const Invalid: Story = {
  args: { type: "email", defaultValue: "name@example" },
  render: (args) => (
    <Field
      label="Email"
      error="Enter a complete email address, such as name@example.com."
      {...args}
    />
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Email" })
    await expect(input).toBeInvalid()
    await expect(input).toHaveAccessibleDescription(
      "Enter a complete email address, such as name@example.com."
    )
  },
}
