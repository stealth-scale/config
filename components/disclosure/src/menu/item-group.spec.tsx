import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemGroup } from "#menu/item-group.tsx";
import { grouped, listed } from "#menu/menu.fixtures.tsx";

describe("ItemGroup", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<ItemGroup value="density" />));

    expect(slotElement(container, "menu", "itemGroup").tagName).toBe("DIV");
  });

  it("carries the group role so a screen reader reports the set", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("group")).toBeDefined();
  });

  it("is named by the heading that shares its value", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "menu", "itemGroupLabel").id,
    );
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(listed(<ItemGroup as="section" value="density" />));

    expect(slotElement(container, "menu", "itemGroup").tagName).toBe("SECTION");
  });
});
