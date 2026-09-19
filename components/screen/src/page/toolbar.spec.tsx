import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Toolbar } from "#page/toolbar.tsx";

describe("Toolbar", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Toolbar>Filters</Toolbar>));

    expect(slotElement(container, "page", "toolbar").tagName).toBe("DIV");
  });

  it("stays put where a caller asks", () => {
    const { container } = render(paged(<Toolbar sticky>Filters</Toolbar>));

    expect(slotElement(container, "page", "toolbar").dataset["sticky"]).toBe("");
  });
});
