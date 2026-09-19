import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#nav-list/indicator.tsx";
import { branched } from "#nav-list/nav-list.fixtures.tsx";

describe("Indicator", () => {
  it("draws a span inside the branch it needs above it", () => {
    const { container } = render(branched(<Indicator>v</Indicator>));

    expect(slotElement(container, "nav-list", "indicator").tagName).toBe("SPAN");
  });

  it("keeps the mark out of the accessibility tree", () => {
    const { container } = render(branched(<Indicator>v</Indicator>));

    expect(slotElement(container, "nav-list", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("reports the branch as closed while its list is hidden", () => {
    const { container } = render(branched(<Indicator>v</Indicator>));

    expect(slotElement(container, "nav-list", "indicator").dataset["state"]).toBe("closed");
  });

  it("reports the branch as open while its list is shown", () => {
    const { container } = render(branched(<Indicator>v</Indicator>, { defaultOpen: true }));

    expect(slotElement(container, "nav-list", "indicator").dataset["state"]).toBe("open");
  });
});
