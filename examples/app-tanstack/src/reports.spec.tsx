import { type ReactElement } from "react";
import { createRoot } from "react-dom/client";

import { describe, expect, test, vi } from "vitest";

import { Reports } from "#reports.tsx";

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

describe("reports", () => {
  test("draws what the other application answered, once it has", async () => {
    await expect(drawn(<Reports />)).resolves.toContain("3 open");
  });

  test("shows nothing of its own once the other application has answered", async () => {
    await expect(drawn(<Reports />)).resolves.not.toContain("Loading");
  });
});
