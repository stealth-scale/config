import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { settled } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Content } from "#tooltip/content.tsx";
import { composed, hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(hinted(<Content>Saves without closing</Content>));

    expect(slotElement(container, "tooltip", "content").tagName).toBe("DIV");
  });

  it("carries the tooltip role so a screen reader knows what it is", async () => {
    render(composed({ defaultOpen: true }));
    await settled();

    expect(screen.getByRole("tooltip").textContent).toContain("Saves without closing");
  });

  it("takes the look the root states, as the tip of the point does", () => {
    const { container } = render(composed({ defaultOpen: true, variant: "surface" }));

    expect(slotClasses(container, "tooltip", "content")).toContain(
      slotVariantClass("tooltip", "content", "variant", "surface"),
    );
    expect(slotClasses(container, "tooltip", "arrowTip")).toContain(
      slotVariantClass("tooltip", "arrowTip", "variant", "surface"),
    );
  });

  it("draws the element as names", () => {
    const { container } = render(hinted(<Content as="section">Saves</Content>));

    expect(slotElement(container, "tooltip", "content").tagName).toBe("SECTION");
  });
});
