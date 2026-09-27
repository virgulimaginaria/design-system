import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Input } from "#components/input"

describe("Input", () => {
  it("is labelled by its <label>", () => {
    render(
      <>
        <label htmlFor="name">Full name</label>
        <input hidden />
        <Input id="name" />
      </>
    )
    expect(
      screen.getByRole("textbox", { name: "Full name" })
    ).toBeInTheDocument()
  })

  it("accepts typed text", async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Search" />)

    await user.type(screen.getByRole("textbox"), "Ada Lovelace")

    expect(screen.getByRole("textbox")).toHaveValue("Ada Lovelace")
  })

  it("cannot be edited while disabled", async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Code" disabled defaultValue="ABC" />)

    await user.type(screen.getByRole("textbox"), "D")

    expect(screen.getByRole("textbox")).toBeDisabled()
    expect(screen.getByRole("textbox")).toHaveValue("ABC")
  })

  it("exposes an invalid state and its error description", () => {
    render(
      <>
        <Input aria-label="Email" aria-invalid aria-describedby="email-error" />
        <p id="email-error">Enter a valid email address.</p>
      </>
    )
    const input = screen.getByRole("textbox")
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription("Enter a valid email address.")
  })
})
