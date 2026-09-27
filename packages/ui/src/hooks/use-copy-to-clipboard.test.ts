import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  DEFAULT_RESET_DELAY,
  useCopyToClipboard,
} from "#hooks/use-copy-to-clipboard"

import { mockClipboard, removeClipboard } from "../test/clipboard"

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("starts idle", () => {
    const { result } = renderHook(() => useCopyToClipboard())
    expect(result.current.status).toBe("idle")
  })

  it("writes the exact value and reports copied", async () => {
    const writeText = mockClipboard()
    const onCopy = vi.fn()
    const { result } = renderHook(() => useCopyToClipboard({ onCopy }))

    let succeeded: boolean | undefined
    await act(async () => {
      succeeded = await result.current.copy("509123456")
    })

    expect(writeText).toHaveBeenCalledExactlyOnceWith("509123456")
    expect(succeeded).toBe(true)
    expect(result.current.status).toBe("copied")
    expect(onCopy).toHaveBeenCalledWith("509123456")
  })

  it("is copying while the write is pending", async () => {
    let finish = () => {}
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((resolve) => {
            finish = resolve
          }),
      },
    })
    const { result } = renderHook(() => useCopyToClipboard())

    let pending: Promise<boolean> = Promise.resolve(false)
    act(() => {
      pending = result.current.copy("A-1")
    })
    expect(result.current.status).toBe("copying")

    await act(async () => {
      finish()
      await pending
    })
    expect(result.current.status).toBe("copied")
  })

  it("returns to idle after the default delay", async () => {
    mockClipboard()
    const { result } = renderHook(() => useCopyToClipboard())
    await act(() => result.current.copy("A-1"))

    act(() => vi.advanceTimersByTime(DEFAULT_RESET_DELAY - 1))
    expect(result.current.status).toBe("copied")
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.status).toBe("idle")
  })

  it("honours a custom reset delay", async () => {
    mockClipboard()
    const { result } = renderHook(() => useCopyToClipboard({ resetDelay: 500 }))
    await act(() => result.current.copy("A-1"))

    act(() => vi.advanceTimersByTime(500))
    expect(result.current.status).toBe("idle")
  })

  it("reports a rejected write as an error without throwing", async () => {
    const denied = new DOMException("Denied", "NotAllowedError")
    mockClipboard(denied)
    const onCopy = vi.fn()
    const onCopyError = vi.fn()
    const { result } = renderHook(() =>
      useCopyToClipboard({ onCopy, onCopyError })
    )

    let succeeded: boolean | undefined
    await act(async () => {
      succeeded = await result.current.copy("A-1")
    })

    expect(succeeded).toBe(false)
    expect(result.current.status).toBe("error")
    expect(onCopyError).toHaveBeenCalledWith(denied)
    expect(onCopy).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(DEFAULT_RESET_DELAY))
    expect(result.current.status).toBe("idle")
  })

  it("reports an error when the Clipboard API is unavailable", async () => {
    removeClipboard()
    const onCopyError = vi.fn()
    const { result } = renderHook(() => useCopyToClipboard({ onCopyError }))

    await act(() => result.current.copy("A-1"))

    expect(result.current.status).toBe("error")
    expect(onCopyError).toHaveBeenCalledWith(expect.any(Error))
  })

  it("restarts the reset delay on a new copy", async () => {
    mockClipboard()
    const { result } = renderHook(() => useCopyToClipboard())
    await act(() => result.current.copy("A-1"))
    act(() => vi.advanceTimersByTime(DEFAULT_RESET_DELAY - 100))

    await act(() => result.current.copy("A-2"))
    act(() => vi.advanceTimersByTime(100))

    expect(result.current.status).toBe("copied")
  })

  it("keeps the outcome of the latest attempt", async () => {
    const resolvers: Array<() => void> = []
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((_, reject) => {
            resolvers.push(() => reject(new Error("late failure")))
          }),
      },
    })
    const { result } = renderHook(() => useCopyToClipboard())

    let first: Promise<boolean> = Promise.resolve(false)
    act(() => {
      first = result.current.copy("A-1")
    })
    mockClipboard()
    await act(() => result.current.copy("A-2"))
    await act(async () => {
      resolvers[0]?.()
      await first
    })

    expect(result.current.status).toBe("copied")
  })
})
