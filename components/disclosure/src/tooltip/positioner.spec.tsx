import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Positioner } from "#tooltip/positioner.tsx";
import { composed, hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("Positioner", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(hinted(<Positioner />));

    expect(slotElement(container, "tooltip", "positioner").tagName).toBe("DIV");
  });

  it("is placed by the machine rather than by the recipe", () => {
    const { container } = render(composed({ defaultOpen: true }));

    expect(slotElement(container, "tooltip", "positioner").style.position).toBe("absolute");
  });

  it("draws the element as names so a caller can portal it", () => {
    const { container } = render(hinted(<Positioner as="span" />));

    expect(slotElement(container, "tooltip", "positioner").tagName).toBe("SPAN");
  });
});
