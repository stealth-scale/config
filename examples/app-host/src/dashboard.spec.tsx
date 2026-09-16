import { type ReactElement, Suspense } from "react";

import { render, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Dashboard } from "#dashboard.tsx";

/**
 * Renders into a fresh element and waits until whatever suspended has arrived.
 *
 * @param element - What to render, including the boundary the lazy import needs.
 * @returns The text on the page once the substitute for the remote has rendered.
 */
function drawn(element: ReactElement): Promise<string> {
  const { container } = render(element);

  return waitFor(() => {
    const held = container.textContent;

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
