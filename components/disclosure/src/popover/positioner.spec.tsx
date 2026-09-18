import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#popover/popover.fixtures.tsx";
import { Positioner } from "#popover/positioner.tsx";

describe("Positioner", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(opened(<Positioner />));

    expect(slotElement(container, "popover", "positioner").tagName).toBe("DIV");
  });

  it("carries the slot class the recipe styles it by", () => {
    const { container } = render(opened(<Positioner />));

    expect(slotElement(container, "popover", "positioner").className).toContain(
      "popover__positioner",
    );
  });

  it("draws the element as names", () => {
    const { container } = render(opened(<Positioner as="span" />));

    expect(slotElement(container, "popover", "positioner").tagName).toBe("SPAN");
  });
});
