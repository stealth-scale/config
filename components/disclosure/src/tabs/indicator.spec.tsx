import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#tabs/indicator.tsx";
import { composed, tabbed } from "#tabs/tabs.fixtures.tsx";

describe("Indicator", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(tabbed(<Indicator />));

    expect(slotElement(container, "tabs", "indicator").tagName).toBe("DIV");
  });

  it("says which way the set runs so the recipe can place it", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "tabs", "indicator").dataset["orientation"]).toBe("vertical");
  });

  it("is hidden until there is a control to measure", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tabs", "indicator").hasAttribute("hidden")).toBe(true);
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(tabbed(<Indicator as="span" />));

    expect(slotElement(container, "tabs", "indicator").tagName).toBe("SPAN");
  });
});
