import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#toolbar/item.tsx";
import { Search } from "#toolbar/search.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

/**
 * Draws the row a case opens and closes, with the control that opens the search beside it.
 *
 * @param opened - Whether the search covers the row.
 * @returns The row, holding the control and the search.
 */
function drawn(opened: boolean): ReactElement {
  return ranged(
    <>
      <Item>Open the search</Item>
      <Search opened={opened}>
        <input aria-label="Search invoices" type="search" />
      </Search>
    </>,
  );
}

describe("Search", () => {
  it("draws a div inside the row it needs above it", () => {
    const { container } = render(ranged(<Search>field</Search>));

    expect(slotElement(container, "toolbar", "search").tagName).toBe("DIV");
  });

  it("sits in its band while it is closed", () => {
    const { container } = render(ranged(<Search>field</Search>));

    expect(slotElement(container, "toolbar", "search").dataset["opened"]).toBeUndefined();
  });

  it("covers the row while it is open", () => {
    const { container } = render(ranged(<Search opened>field</Search>));

    expect(slotElement(container, "toolbar", "search").dataset["opened"]).toBe("");
  });

  it("puts the reader in the field when it opens", () => {
    render(drawn(true));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("leaves the reader where they were while it is closed", () => {
    render(drawn(false));

    expect(document.activeElement).toBe(document.body);
  });

  it("puts the reader back on the control that opened it", () => {
    const { rerender } = render(drawn(false));

    screen.getByRole("button", { name: "Open the search" }).focus();
    rerender(drawn(true));
    rerender(drawn(false));

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open the search" }));
  });
});
