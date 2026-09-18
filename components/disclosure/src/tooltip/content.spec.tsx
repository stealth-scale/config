import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Content } from "#tooltip/content.tsx";
import { composed, hinted } from "#tooltip/tooltip.fixtures.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(hinted(<Content>Saves without closing</Content>));

    expect(slotElement(container, "tooltip", "content").tagName).toBe("DIV");
  });

  it("carries the tooltip role so a screen reader knows what it is", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("tooltip").textContent).toContain("Saves without closing");
  });

  it("takes the look the root states, as the tip of the point does", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, variant: "surface" }));

    expect(slotClasses(container, "tooltip", "content")).toContain(
      slotVariantClass("tooltip", "content", "variant", "surface"),
    );
    expect(slotClasses(container, "tooltip", "arrowTip")).toContain(
      slotVariantClass("tooltip", "arrowTip", "variant", "surface"),
    );
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(hinted(<Content as="section">Saves</Content>));

    expect(slotElement(container, "tooltip", "content").tagName).toBe("SECTION");
  });
});
