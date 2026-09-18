import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#menu/arrow.tsx";
import { composed, listed } from "#menu/menu.fixtures.tsx";

describe("Arrow", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<Arrow />));

    expect(slotElement(container, "menu", "arrow").tagName).toBe("DIV");
  });

  it("is placed by the machine rather than by the recipe", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "arrow").style.position).toBe("absolute");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(listed(<Arrow as="span" />));

    expect(slotElement(container, "menu", "arrow").tagName).toBe("SPAN");
  });
});
