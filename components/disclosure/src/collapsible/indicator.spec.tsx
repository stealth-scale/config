import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, disclosed } from "#collapsible/collapsible.fixtures.tsx";
import { Indicator } from "#collapsible/indicator.tsx";

describe("Indicator", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(disclosed(<Indicator>v</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").tagName).toBe("SPAN");
  });

  it("carries the state the recipe turns it by", () => {
    const { container } = render(composed({ defaultOpen: true }));

    expect(slotElement(container, "collapsible", "indicator").dataset["state"]).toBe("open");
  });

  it("draws the element as names", () => {
    const { container } = render(disclosed(<Indicator as="svg">v</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").tagName).toBe("svg");
  });

  it("keeps its mark out of the name the trigger is announced by", () => {
    const { container } = render(disclosed(<Indicator>▾</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("reads a mark out where a caller says it means something", () => {
    const { container } = render(disclosed(<Indicator aria-hidden={false}>3 more</Indicator>));

    expect(slotElement(container, "collapsible", "indicator").getAttribute("aria-hidden")).toBe(
      "false",
    );
  });
});
