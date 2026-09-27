import { vi } from "vitest"

/**
 * Replaces `navigator.clipboard` with a stub whose `writeText` resolves, or
 * rejects with `failure` when given. Call it after `userEvent.setup()`, which
 * installs its own clipboard stub.
 */
export function mockClipboard(failure?: unknown) {
  const writeText = vi.fn((text: string) => {
    void text
    return failure === undefined ? Promise.resolve() : Promise.reject(failure)
  })
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })
  return writeText
}

/** Removes `navigator.clipboard`, as in an insecure context. */
export function removeClipboard() {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: undefined,
  })
}
