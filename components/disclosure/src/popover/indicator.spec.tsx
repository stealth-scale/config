import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#popover/indicator.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Indicator", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(opened(<Indicator />));

    expect(slotElement(container, "popover", "indicator").tagName).toBe("SPAN");
  });

  it("carries the slot class the recipe styles it by", () => {
    const { container } = render(opened(<Indicator />));

    expect(slotElement(container, "popover", "indicator").className).toContain(
      "popover__indicator",
    );
  });

  it("draws the element as names", () => {
    const { container } = render(opened(<Indicator as="svg" />));

    expect(slotElement(container, "popover", "indicator").tagName).toBe("svg");
  });
});
