import { type ReactElement } from "react";

import { render, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Reports } from "#reports.tsx";

function drawn(element: ReactElement): Promise<string> {
  const { container } = render(element);

  return waitFor(() => {
    const held = container.textContent;

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
