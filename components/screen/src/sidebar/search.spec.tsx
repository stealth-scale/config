import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Search } from "#sidebar/search.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Search", () => {
  it("draws a band inside the column it needs above it", () => {
    const { container } = render(aside(<Search />));

    expect(slotElement(container, "sidebar", "search").tagName).toBe("DIV");
  });

  it("holds the field a caller puts in it", () => {
    const { container } = render(
      aside(
        <Search>
          <input aria-label="Search projects" type="search" />
        </Search>,
      ),
    );

    expect(slotElement(container, "sidebar", "search").querySelector("input")).not.toBeNull();
  });
});
