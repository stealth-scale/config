import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ArrowTip } from "#tooltip/arrow-tip.tsx";
import { hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("ArrowTip", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(hinted(<ArrowTip />));

    expect(slotElement(container, "tooltip", "arrowTip").tagName).toBe("DIV");
  });

  it("is filled from the custom property the box states its surface as", () => {
    const { container } = render(hinted(<ArrowTip />));

    expect(slotElement(container, "tooltip", "arrowTip").style.background).toBe(
      "var(--arrow-background)",
    );
  });

  it("fills the whole of the arrow the machine placed", () => {
    const { container } = render(hinted(<ArrowTip />));
    const { style } = slotElement(container, "tooltip", "arrowTip");

    expect(style.width).toBe("100%");
    expect(style.height).toBe("100%");
  });

  it("draws the element as names", () => {
    const { container } = render(hinted(<ArrowTip as="span" />));

    expect(slotElement(container, "tooltip", "arrowTip").tagName).toBe("SPAN");
  });
});
