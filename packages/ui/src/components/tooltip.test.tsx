import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#components/tooltip"

function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent>Opens the help centre</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe("Tooltip", () => {
  it("is hidden until the trigger is hovered or focused", () => {
    render(<Example />)
    expect(screen.queryByText("Opens the help centre")).not.toBeInTheDocument()
  })

  it("opens on keyboard focus", async () => {
    const user = userEvent.setup()
    render(<Example />)

    await user.tab()

    expect(screen.getByRole("button", { name: "Help" })).toHaveFocus()
    expect(await screen.findByText("Opens the help centre")).toBeVisible()
  })

  it("opens on hover", async () => {
    const user = userEvent.setup()
    render(<Example />)

    await user.hover(screen.getByRole("button", { name: "Help" }))

    expect(await screen.findByText("Opens the help centre")).toBeVisible()
  })

  it("closes with Escape", async () => {
    const user = userEvent.setup()
    render(<Example />)

    await user.tab()
    await screen.findByText("Opens the help centre")
    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(
        screen.queryByText("Opens the help centre")
      ).not.toBeInTheDocument()
    })
  })
})
