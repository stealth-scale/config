import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Tabs } from "#page/tabs.ts";

describe("Tabs", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Tabs>Lines</Tabs>));

    expect(slotElement(container, "page", "tabs").tagName).toBe("DIV");
  });

  it("draws the element as names, for a strip from another package", () => {
    const { container } = render(paged(<Tabs as="ul">Lines</Tabs>));

    expect(slotElement(container, "page", "tabs").tagName).toBe("UL");
  });
});
