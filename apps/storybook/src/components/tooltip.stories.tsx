import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, waitFor } from "storybook/test"

import { Button } from "@virgulimaginaria/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@virgulimaginaria/ui/tooltip"

const meta = {
  title: "Components/Tooltip",
  component: TooltipContent,
  subcomponents: { Tooltip, TooltipTrigger, TooltipProvider },
  args: {
    side: "top",
    children: "Copies the value to the clipboard",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Copy
        </TooltipTrigger>
        <TooltipContent {...args} />
      </Tooltip>
    </TooltipProvider>
  ),
  parameters: {
    docs: {
      description: {
        component: `
A short label or description that appears next to an element on hover and on keyboard focus. Built on the Base UI \`Tooltip\`.

\`\`\`tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@virgulimaginaria/ui/tooltip"

<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>Copy</TooltipTrigger>
  <TooltipContent>Copies the value to the clipboard</TooltipContent>
</Tooltip>
\`\`\`

**When to use.** To name icon-only controls or add a brief hint. Do not use a tooltip for essential information, for errors, or for anything interactive: it is invisible until hovered or focused, and unavailable on most touch devices.

**Composition.** \`TooltipTrigger\` renders a \`<button>\` by default; use its \`render\` prop to make an existing component (such as \`Button\`) the trigger instead of nesting buttons. Wrap the application in \`TooltipProvider\` once to share delays between tooltips.

**Accessibility**

- Opens when the trigger receives keyboard focus and closes with <kbd>Escape</kbd>.
- The trigger must be focusable. A disabled \`Button\` is only a valid trigger with \`focusableWhenDisabled\`.
- Keep the text short; it is announced as the trigger's description.
`,
      },
    },
  },
} satisfies Meta<typeof TooltipContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const KeyboardInteraction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Press <kbd>Tab</kbd> to focus the trigger: the tooltip opens. Press <kbd>Escape</kbd> to dismiss it.",
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab()
    await expect(canvas.getByRole("button", { name: "Copy" })).toHaveFocus()
    await expect(
      await screen.findByText("Copies the value to the clipboard")
    ).toBeVisible()

    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(
        screen.queryByText("Copies the value to the clipboard")
      ).not.toBeInTheDocument()
    )
  },
}

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-2">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" />}>
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>Shown on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
}
