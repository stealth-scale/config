import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, listed } from "#menu/menu.fixtures.tsx";
import { Positioner } from "#menu/positioner.tsx";

describe("Positioner", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<Positioner />));

    expect(slotElement(container, "menu", "positioner").tagName).toBe("DIV");
  });

  it("is placed by the machine rather than by the recipe", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "positioner").style.position).toBe("absolute");
  });

  it("holds the panel so the panel can read the room left on the screen", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(
      slotElement(container, "menu", "positioner").querySelector("[data-part=content]"),
    ).not.toBeNull();
  });

  it("draws the element as names so a caller can portal it", async () => {
    const { container } = await drawn(listed(<Positioner as="span" />));

    expect(slotElement(container, "menu", "positioner").tagName).toBe("SPAN");
  });
});
