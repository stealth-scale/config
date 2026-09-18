import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#popover/description.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Description", () => {
  it("draws a p inside the root it needs above it", () => {
    const { container } = render(opened(<Description />));

    expect(slotElement(container, "popover", "description").tagName).toBe("P");
  });

  it("carries the slot class the recipe styles it by", () => {
    const { container } = render(opened(<Description />));

    expect(slotElement(container, "popover", "description").className).toContain(
      "popover__description",
    );
  });

  it("draws the element as names", () => {
    const { container } = render(opened(<Description as="span" />));

    expect(slotElement(container, "popover", "description").tagName).toBe("SPAN");
  });
});
