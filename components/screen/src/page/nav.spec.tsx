import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Nav } from "#page/nav.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Nav", () => {
  it("draws a navigation inside the column it needs above it", () => {
    const { container } = render(paged(<Nav aria-label="Invoice">Lines</Nav>));

    expect(slotElement(container, "page", "nav").tagName).toBe("NAV");
  });

  it("is a landmark a reader can name and jump to", () => {
    render(paged(<Nav aria-label="Invoice">Lines</Nav>));

    expect(screen.getByRole("navigation", { name: "Invoice" })).toBeTruthy();
  });

  it("stays put where a caller asks", () => {
    const { container } = render(
      paged(
        <Nav aria-label="Invoice" sticky>
          Lines
        </Nav>,
      ),
    );

    expect(slotElement(container, "page", "nav").dataset["sticky"]).toBe("");
  });
});
