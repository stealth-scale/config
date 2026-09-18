import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#menu/item.tsx";
import { composed, kept, listed } from "#menu/menu.fixtures.tsx";

describe("Item", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<Item value="rename">Rename</Item>));

    expect(slotElement(container, "menu", "item").tagName).toBe("DIV");
  });

  it("carries the menu item role", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Rename" })).toBeDefined();
  });

  it("names itself so the machine can report which row was chosen", async () => {
    const { container } = await drawn(listed(<Item value="rename">Rename</Item>));

    expect(slotElement(container, "menu", "item").dataset["value"]).toBe("rename");
  });

  it("says a reader cannot choose it where a caller disables it", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Archive" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("reports nothing when a disabled row is pressed", async () => {
    const told = vi.fn<(details: { readonly value: string }) => void>();

    await drawn(composed({ defaultOpen: true, onSelect: told }));
    await pressed(screen.getByRole("menuitem", { name: "Archive" }));

    expect(told).not.toHaveBeenCalled();
  });

  it("says what the row is for where a caller states a tone", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Delete" }).dataset["tone"]).toBe("critical");
  });

  it("carries no tone where a caller states none", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("menuitem", { name: "Rename" }).dataset["tone"]).toBeUndefined();
  });

  it("says the highlight is on it once the pointer goes down", async () => {
    await drawn(composed({ defaultOpen: true }));

    const row = screen.getByRole("menuitem", { name: "Rename" });

    fireEvent.pointerDown(row);
    await settled();

    expect(screen.getByRole("menuitem", { name: "Rename" }).dataset["highlighted"]).toBe("");
  });

  it("matches typeahead on the words a caller gives it rather than the ones it shows", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename" valueText="Change the name">
          Rename
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "item").dataset["valuetext"]).toBe("Change the name");
  });

  it("shuts the menu once a row is chosen", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(screen.getByRole("menuitem", { name: "Rename" }));

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("leaves the menu open where the row says choosing it does not close", async () => {
    await drawn(kept({ defaultOpen: true }));
    await pressed(screen.getByRole("menuitem", { name: "Bold" }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      listed(
        <Item as="a" value="rename">
          Rename
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "item").tagName).toBe("A");
  });
});
