import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "#components/button"

describe("Button", () => {
  it("renders an accessible button with its label", () => {
    render(<Button>Save changes</Button>)
    expect(
      screen.getByRole("button", { name: "Save changes" })
    ).toBeInTheDocument()
  })

  it("calls onClick when activated with the mouse or the keyboard", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Continue</Button>)

    await user.click(screen.getByRole("button"))
    await user.keyboard("{Enter}")
    await user.keyboard(" ")

    expect(onClick).toHaveBeenCalledTimes(3)
  })

  it("is reachable with the keyboard", async () => {
    const user = userEvent.setup()
    render(<Button>Focus me</Button>)

    await user.tab()

    expect(screen.getByRole("button")).toHaveFocus()
  })

  it("does not trigger actions while disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Unavailable
      </Button>
    )

    await user.click(screen.getByRole("button"))

    expect(screen.getByRole("button")).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it("can stay focusable while disabled", async () => {
    const user = userEvent.setup()
    render(
      <Button disabled focusableWhenDisabled>
        Unavailable
      </Button>
    )

    await user.tab()

    const button = screen.getByRole("button")
    expect(button).toHaveFocus()
    expect(button).toHaveAttribute("aria-disabled", "true")
  })

  it("merges a custom className with the variant classes", () => {
    render(
      <Button variant="secondary" className="w-full">
        Wide
      </Button>
    )
    expect(screen.getByRole("button")).toHaveClass("w-full", "bg-secondary")
  })
})
