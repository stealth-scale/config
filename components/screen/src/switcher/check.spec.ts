import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#switcher/switcher.fixtures.tsx";

describe("Check", () => {
  it("draws the tick inside the row it belongs to", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switcher", "check")).toBeTruthy();
  });

  it("reports the state of the row it sits in", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switcher", "check").dataset["state"]).toBe("checked");
  });
});
