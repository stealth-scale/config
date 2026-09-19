import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#switcher/switcher.fixtures.tsx";

describe("Check", () => {
  it("draws the tick inside the row it belongs to", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "switcher", "check")).toBeTruthy();
  });

  it("reports the state of the row it sits in", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "switcher", "check").dataset["state"]).toBe("checked");
  });
});
