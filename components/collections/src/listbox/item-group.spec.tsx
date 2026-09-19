import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ItemGroupLabel } from "#listbox/item-group-label.tsx";
import { ItemGroup } from "#listbox/item-group.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("ItemGroup", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(offered(<ItemGroup id="recent" />));

    expect(slotElement(container, "listbox", "itemGroup").tagName).toBe("DIV");
  });

  it("carries the group role", () => {
    render(offered(<ItemGroup id="recent" />));

    expect(screen.getByRole("group")).toBeTruthy();
  });

  it("is named by the heading that shares its identifier", () => {
    render(
      offered(
        <ItemGroup id="recent">
          <ItemGroupLabel htmlFor="recent">Recent</ItemGroupLabel>
        </ItemGroup>,
      ),
    );

    expect(screen.getByRole("group", { name: "Recent" })).toBeTruthy();
  });
});
