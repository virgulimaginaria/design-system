import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CopyableInput } from "#components/copyable-input"

import { mockClipboard } from "../test/clipboard"

describe("CopyableInput", () => {
  it("is a labelled text field with a copy button", () => {
    render(
      <>
        <label htmlFor="code">Code</label>
        <CopyableInput id="code" defaultValue="A-1" />
      </>
    )
    expect(screen.getByRole("textbox", { name: "Code" })).toHaveValue("A-1")
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument()
  })

  it("copies the field's value", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyableInput aria-label="Code" value="A-1" readOnly />)

    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(writeText).toHaveBeenCalledExactlyOnceWith("A-1")
    expect(screen.getByRole("status")).toHaveTextContent("Copied")
  })

  it("copies copyValue instead of the formatted value", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(
      <CopyableInput
        aria-label="Account"
        value="PT50 0000 0000 0000 0000 0000 0"
        copyValue="PT50000000000000000000000"
        readOnly
      />
    )

    expect(screen.getByRole("textbox")).toHaveValue(
      "PT50 0000 0000 0000 0000 0000 0"
    )
    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(writeText).toHaveBeenCalledExactlyOnceWith(
      "PT50000000000000000000000"
    )
  })

  it("copies what was typed into an uncontrolled field", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <CopyableInput aria-label="Code" defaultValue="A-" onChange={onChange} />
    )
    await user.type(screen.getByRole("textbox"), "7")
    const writeText = mockClipboard()

    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(onChange).toHaveBeenCalled()
    expect(writeText).toHaveBeenCalledExactlyOnceWith("A-7")
  })

  it("stays read-only but copyable", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyableInput aria-label="Code" value="A-1" readOnly />)

    await user.type(screen.getByRole("textbox"), "X")
    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(screen.getByRole("textbox")).toHaveValue("A-1")
    expect(writeText).toHaveBeenCalledOnce()
  })

  it("disables the field and the copy action together", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyableInput aria-label="Code" defaultValue="A-1" disabled />)

    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(screen.getByRole("textbox")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled()
    expect(writeText).not.toHaveBeenCalled()
  })

  it("forwards Input props and accessibility attributes", () => {
    render(
      <>
        <CopyableInput
          aria-label="Code"
          aria-invalid
          aria-describedby="code-hint"
          placeholder="A-0000"
          name="code"
        />
        <p id="code-hint">Four digits.</p>
      </>
    )
    const input = screen.getByRole("textbox", { name: "Code" })
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription("Four digits.")
    expect(input).toHaveAttribute("placeholder", "A-0000")
    expect(input).toHaveAttribute("name", "code")
  })

  it("keeps the copy button after the field in the tab order", async () => {
    const user = userEvent.setup()
    render(<CopyableInput aria-label="Code" defaultValue="A-1" />)

    await user.tab()
    expect(screen.getByRole("textbox")).toHaveFocus()
    await user.tab()
    expect(screen.getByRole("button", { name: "Copy" })).toHaveFocus()
  })
})
