import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#tooltip/arrow.tsx";
import { hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("Arrow", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(hinted(<Arrow />));

    expect(slotElement(container, "tooltip", "arrow").tagName).toBe("DIV");
  });

  it("is placed by the machine against whichever edge the box sits on", () => {
    const { container } = render(hinted(<Arrow />));

    expect(slotElement(container, "tooltip", "arrow").style.position).toBe("absolute");
  });

  it("draws the element as names", () => {
    const { container } = render(hinted(<Arrow as="span" />));

    expect(slotElement(container, "tooltip", "arrow").tagName).toBe("SPAN");
  });
});
