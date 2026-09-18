import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { ArrowTip } from "#popover/arrow-tip.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("ArrowTip", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(opened(<ArrowTip />));

    expect(slotElement(container, "popover", "arrowTip").tagName).toBe("DIV");
  });

  it("carries the slot class the recipe styles it by", () => {
    const { container } = render(opened(<ArrowTip />));

    expect(slotElement(container, "popover", "arrowTip").className).toContain(
      slotClass("popover", "arrowTip"),
    );
  });

  it("draws the element as names", () => {
    const { container } = render(opened(<ArrowTip as="span" />));

    expect(slotElement(container, "popover", "arrowTip").tagName).toBe("SPAN");
  });
});
