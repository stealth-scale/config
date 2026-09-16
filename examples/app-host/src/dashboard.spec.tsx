import { type ReactElement, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { describe, expect, test, vi } from "vitest";

import { Dashboard } from "#dashboard.tsx";

/**
 * Renders into a fresh element and waits until whatever suspended has arrived.
 *
 * @param element - What to render, including the boundary the lazy import needs.
 * @returns The text on the page once the substitute for the remote has rendered.
 */
function drawn(element: ReactElement): Promise<string> {
  const into = document.createElement("div");

  document.body.append(into);
  createRoot(into).render(element);

  return vi.waitFor(() => {
    const held = into.textContent ?? "";

    expect(held).toContain("open");

    return held;
  });
}

describe("dashboard", () => {
  test("draws what the other application answered, reached by the name the config gave it", async () => {
    await expect(
      drawn(
        <Suspense fallback={"Loading."}>
          <Dashboard count={7} />
        </Suspense>,
      ),
    ).resolves.toContain("7 open");
  });
});
