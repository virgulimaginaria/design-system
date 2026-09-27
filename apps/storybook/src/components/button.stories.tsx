import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn } from "storybook/test"

import { Button } from "@virgulimaginaria/ui/button"

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Save changes",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "default",
        "lg",
        "icon-xs",
        "icon-sm",
        "icon",
        "icon-lg",
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Triggers an action. Built on the Base UI \`Button\`, so it renders a native \`<button>\`.

\`\`\`tsx
import { Button } from "@virgulimaginaria/ui/button"
\`\`\`

**When to use.** For actions (submit, save, open a dialog). For navigation to another page use a link; if it must *look* like a button, render the link through Base UI's \`render\` prop.

**Accessibility**

- Activated with <kbd>Enter</kbd> and <kbd>Space</kbd>; shows a visible focus ring for keyboard users only (\`:focus-visible\`).
- The label must describe the action. Icon-only buttons need an \`aria-label\`.
- \`disabled\` removes the button from the tab order. Use \`focusableWhenDisabled\` when users still need to discover it (for example, a tooltip explains why it is unavailable).
- The default size is 32px high, above the WCAG 2.2 minimum target size of 24×24px; prefer \`lg\` on touch-first layouts.
`,
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancel" },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="destructive">
        Delete
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  args: {
    size: "icon",
    variant: "outline",
    "aria-label": "Add item",
    children: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Add item" })).toBeVisible()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button")).toBeDisabled()
  },
}

export const FocusableWhenDisabled: Story = {
  args: { disabled: true, focusableWhenDisabled: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab()
    const button = canvas.getByRole("button")
    await expect(button).toHaveFocus()
    await expect(button).toHaveAttribute("aria-disabled", "true")
  },
}

export const KeyboardFocus: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Press <kbd>Tab</kbd> to move focus to the button: the focus ring appears. <kbd>Enter</kbd> or <kbd>Space</kbd> activates it.",
      },
    },
  },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.tab()
    const button = canvas.getByRole("button")
    await expect(button).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard(" ")
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}
