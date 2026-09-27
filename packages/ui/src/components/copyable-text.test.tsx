import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { CopyableText } from "#components/copyable-text"

import { mockClipboard } from "../test/clipboard"

describe("CopyableText", () => {
  it("shows the value when there is no display value", () => {
    render(<CopyableText value="REF-0042" />)
    expect(screen.getByText("REF-0042")).toBeVisible()
  })

  it("shows the display value but copies the raw value", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyableText value="509123456" displayValue="509 123 456" />)

    expect(screen.getByText("509 123 456")).toBeVisible()
    expect(screen.queryByText("509123456")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(writeText).toHaveBeenCalledExactlyOnceWith("509123456")
    expect(screen.getByRole("status")).toHaveTextContent("Copied")
  })

  it("describes the copy button with the displayed text", () => {
    render(<CopyableText value="509123456" displayValue="509 123 456" />)
    expect(
      screen.getByRole("button", { name: "Copy" })
    ).toHaveAccessibleDescription("509 123 456")
  })

  it("keeps the text selectable", () => {
    render(<CopyableText value="REF-0042" />)
    expect(screen.getByText("REF-0042")).not.toHaveClass("select-none")
  })

  it("forwards labels to the copy button", () => {
    render(<CopyableText value="REF-0042" copyLabel="Copy reference" />)
    expect(
      screen.getByRole("button", { name: "Copy reference" })
    ).toBeInTheDocument()
  })

  it("disables only the copy action", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyableText value="REF-0042" disabled />)

    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled()
    expect(screen.getByText("REF-0042")).toBeVisible()
    expect(writeText).not.toHaveBeenCalled()
  })
})
