import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#section/body.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Body", () => {
  it("draws a div inside the block it needs above it", () => {
    const { container } = render(blocked(<Body>The plan</Body>));

    expect(slotElement(container, "section", "body").tagName).toBe("DIV");
  });

  it("takes the mark that drops a card's padding", () => {
    const { container } = render(blocked(<Body data-bleed="">A table</Body>));

    expect(slotElement(container, "section", "body").dataset["bleed"]).toBe("");
  });
});
