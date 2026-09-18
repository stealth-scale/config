import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { ArrowTip } from "#menu/arrow-tip.tsx";
import { composed, listed } from "#menu/menu.fixtures.tsx";

describe("ArrowTip", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<ArrowTip />));

    expect(slotElement(container, "menu", "arrowTip").tagName).toBe("DIV");
  });

  it("is placed by the machine rather than by the recipe", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "arrowTip").style.transform).toContain("rotate");
  });

  it("takes the look the root states, as the panel does", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, variant: "glass" }));

    expect(slotClasses(container, "menu", "arrowTip")).toContain(
      slotVariantClass("menu", "arrowTip", "variant", "glass"),
    );
    expect(slotClasses(container, "menu", "content")).toContain(
      slotVariantClass("menu", "content", "variant", "glass"),
    );
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(listed(<ArrowTip as="span" />));

    expect(slotElement(container, "menu", "arrowTip").tagName).toBe("SPAN");
  });
});
