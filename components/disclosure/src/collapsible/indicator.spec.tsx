import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

  it("throws where it is drawn outside the root that holds it together", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Indicator>v</Indicator>)).toThrow(
      "A part of Collapsible was drawn outside the root that holds it together.",
    );

    quiet.mockRestore();
  });
});
