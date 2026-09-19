import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#switcher/indicator.ts";
import { held } from "#switcher/parts.fixtures.tsx";

describe("Indicator", () => {
  it("draws the mark inside the control it needs above it", () => {
    const { container } = render(held(<Indicator>v</Indicator>));

    expect(slotElement(container, "switcher", "indicator")).toBeTruthy();
  });

  it("reports the state the menu is in", () => {
    const { container } = render(held(<Indicator>v</Indicator>));

    expect(slotElement(container, "switcher", "indicator").dataset["state"]).toBe("closed");
  });
});
