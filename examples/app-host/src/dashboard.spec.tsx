import { type ReactElement, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { expect, test, vi } from "vite-plus/test";

import { Dashboard } from "#dashboard.tsx";

/**
 * Draws into a detached element and waits for whatever suspended to arrive.
 *
 * @param element - The element to draw.
 * @returns The text on the page once the other application has answered.
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

test("draws what the other application answered, reached by the name the config gave it", async () => {
  await expect(
    drawn(
      <Suspense fallback={"Loading."}>
        <Dashboard count={7} />
      </Suspense>,
    ),
  ).resolves.toContain("7 open");
});
