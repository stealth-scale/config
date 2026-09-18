import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { grouped, listed, optioned } from "#menu/menu.fixtures.tsx";
import { OptionItem } from "#menu/option-item.tsx";

describe("OptionItem", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked type="checkbox" value="gridlines">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").tagName).toBe("DIV");
  });

  it("carries the checkbox menu item role for a row that stands on its own", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemcheckbox", { name: "Gridlines" })).toBeDefined();
  });

  it("carries the radio menu item role for a row that is one of a set", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemradio", { name: "Comfortable" })).toBeDefined();
  });

  it("tells a screen reader whether the row is on", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(
      screen.getByRole("menuitemradio", { name: "Comfortable" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(
      screen.getByRole("menuitemradio", { name: "Compact" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("says whether the row is on so the recipe can draw the mark", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemradio", { name: "Comfortable" }).dataset["state"]).toBe(
      "checked",
    );
  });

  it("says which of the two kinds the row is", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemcheckbox", { name: "Gridlines" }).dataset["type"]).toBe(
      "checkbox",
    );
  });

  it("tells a caller the reader turned the row off", async () => {
    const told = vi.fn<(checked: boolean) => void>();

    await drawn(optioned(told, { defaultOpen: true }));
    await pressed(screen.getByRole("menuitemcheckbox", { name: "Gridlines" }));

    expect(told).toHaveBeenLastCalledWith(false);
  });

  it("says a reader cannot choose it where a caller disables it", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked disabled type="checkbox" value="gridlines">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").getAttribute("aria-disabled")).toBe("true");
  });

  it("matches typeahead on the words a caller gives it rather than the ones it shows", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked type="checkbox" value="gridlines" valueText="Show the grid">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").dataset["valuetext"]).toBe("Show the grid");
  });

  it("leaves the menu open where the row says choosing it does not close", async () => {
    const told = vi.fn<(checked: boolean) => void>();

    await drawn(optioned(told, { defaultOpen: true }));
    await pressed(screen.getByRole("menuitemcheckbox", { name: "Gridlines" }));

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("says what the row is for where a caller states a tone", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem checked tone="critical" type="checkbox" value="purge">
          Purge on save
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").dataset["tone"]).toBe("critical");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      listed(
        <OptionItem as="label" checked type="checkbox" value="gridlines">
          Gridlines
        </OptionItem>,
      ),
    );

    expect(slotElement(container, "menu", "item").tagName).toBe("LABEL");
  });
});
