import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { listed, nested } from "#menu/menu.fixtures.tsx";
import { TriggerItem } from "#menu/trigger-item.tsx";

describe("TriggerItem", () => {
  it("draws a button inside the nest it needs above it", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));

    expect(slotElement(container, "menu", "triggerItem").tagName).toBe("BUTTON");
  });

  it("carries the menu item role so the menu above counts it as one of its rows", async () => {
    await drawn(nested({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Share" })).toBeDefined();
  });

  it("says it opens a menu of its own", async () => {
    await drawn(nested({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Share" }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("names the submenu it opens", async () => {
    const { container } = await drawn(nested({ defaultOpen: true }));
    const panels = [...container.querySelectorAll("[data-part=content]")];

    expect(screen.getByRole("menuitem", { name: "Share" }).getAttribute("aria-controls")).toBe(
      panels[1]?.id,
    );
  });

  it("throws where the menu it belongs to opens from no other menu", async () => {
    await expect(drawn(listed(<TriggerItem>Share</TriggerItem>))).rejects.toThrow(
      "Menu.TriggerItem was drawn in a menu that opens from no other menu.",
    );
  });
});
