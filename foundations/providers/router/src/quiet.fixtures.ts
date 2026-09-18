import { vi } from "vitest";

/**
 * Runs a render that is expected to fail inside the router, with the console quiet.
 *
 * @remarks
 *   React reports an error a boundary caught, and the router reports the match that failed, both
 *   on the console. A case that asserts the error reads it off the screen, so the two reports are
 *   noise there and are dropped for the run alone. The console is restored whether or not the run
 *   throws.
 * @param run - The render, which the caller awaits through this.
 * @returns Nothing. The caller reads the screen.
 */
export async function quietly(run: () => Promise<void>): Promise<void> {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  try {
    await run();
  } finally {
    error.mockRestore();
    warn.mockRestore();
  }
}
