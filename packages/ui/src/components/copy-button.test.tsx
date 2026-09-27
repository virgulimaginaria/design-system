import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import { CopyButton } from "#components/copy-button"

import { mockClipboard } from "../test/clipboard"

describe("CopyButton", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("is an icon-only button named by its label", () => {
    render(<CopyButton value="A-1" />)

    const button = screen.getByRole("button", { name: "Copy" })
    expect(button).toHaveTextContent("")
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("accepts custom labels", async () => {
    const user = userEvent.setup()
    mockClipboard()
    render(<CopyButton value="A-1" copyLabel="Copiar" copiedLabel="Copiado" />)

    await user.click(screen.getByRole("button", { name: "Copiar" }))

    expect(screen.getByRole("status")).toHaveTextContent("Copiado")
  })

  it("copies its value when clicked and confirms it", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    const onCopy = vi.fn()
    render(<CopyButton value="509123456" onCopy={onCopy} />)

    const button = screen.getByRole("button", { name: "Copy" })
    expect(screen.getByRole("status")).toBeEmptyDOMElement()

    await user.click(button)

    expect(writeText).toHaveBeenCalledExactlyOnceWith("509123456")
    expect(onCopy).toHaveBeenCalledWith("509123456")
    expect(button).toHaveAttribute("data-copy-state", "copied")
    expect(screen.getByRole("status")).toHaveTextContent("Copied")
    // The name stays stable; the outcome is announced by the live region.
    expect(button).toHaveAccessibleName("Copy")
  })

  it("copies with Enter and Space", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyButton value="A-1" />)

    await user.tab()
    expect(screen.getByRole("button", { name: "Copy" })).toHaveFocus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")

    expect(writeText).toHaveBeenCalledTimes(2)
  })

  it("returns to idle after the reset delay", async () => {
    vi.useFakeTimers()
    mockClipboard()
    render(<CopyButton value="A-1" resetDelay={1000} />)
    const button = screen.getByRole("button", { name: "Copy" })

    // user-event waits on timers between actions, so click directly.
    await act(async () => {
      fireEvent.click(button)
    })
    expect(button).toHaveAttribute("data-copy-state", "copied")

    act(() => vi.advanceTimersByTime(1000))
    expect(button).toHaveAttribute("data-copy-state", "idle")
    expect(screen.getByRole("status")).toBeEmptyDOMElement()
  })

  it("reports a failed copy without throwing", async () => {
    const user = userEvent.setup()
    mockClipboard(new DOMException("Denied", "NotAllowedError"))
    const onCopyError = vi.fn()
    render(<CopyButton value="A-1" onCopyError={onCopyError} />)
    const button = screen.getByRole("button", { name: "Copy" })

    await user.click(button)

    expect(button).toHaveAttribute("data-copy-state", "error")
    expect(screen.getByRole("status")).toHaveTextContent("Copy failed")
    expect(onCopyError).toHaveBeenCalledOnce()
  })

  it("does not copy while disabled", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyButton value="A-1" disabled />)

    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled()
    expect(writeText).not.toHaveBeenCalled()
  })

  it("lets onClick cancel the copy", async () => {
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(
      <CopyButton value="A-1" onClick={(event) => event.preventDefault()} />
    )

    await user.click(screen.getByRole("button", { name: "Copy" }))

    expect(writeText).not.toHaveBeenCalled()
  })

  it("shows its label in a tooltip", async () => {
    const user = userEvent.setup()
    render(<CopyButton value="A-1" copyLabel="Copy code" />)

    await user.tab()

    expect(await screen.findByText("Copy code")).toBeVisible()
  })
})
