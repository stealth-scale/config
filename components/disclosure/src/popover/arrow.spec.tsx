import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Arrow } from "#popover/arrow.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Arrow", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(opened(<Arrow />));

    expect(slotElement(container, "popover", "arrow").tagName).toBe("DIV");
  });

  it("carries the slot class the recipe styles it by", () => {
    const { container } = render(opened(<Arrow />));

    expect(slotElement(container, "popover", "arrow").className).toContain("popover__arrow");
  });

  it("draws the element as names", () => {
    const { container } = render(opened(<Arrow as="span" />));

    expect(slotElement(container, "popover", "arrow").tagName).toBe("SPAN");
  });
});
