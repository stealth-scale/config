import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Search } from "#toolbar/search.tsx";
import { ranged, searched } from "#toolbar/toolbar.fixtures.tsx";

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
    render(searched(true));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("leaves the reader where they were while it is closed", () => {
    render(searched(false));

    expect(document.activeElement).toBe(document.body);
  });

  it("puts the reader back on the control that opened it", () => {
    const { rerender } = render(searched(false));

    screen.getByRole("button", { name: "Open the search" }).focus();
    rerender(searched(true));
    rerender(searched(false));

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open the search" }));
  });
});
