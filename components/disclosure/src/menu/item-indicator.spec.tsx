import { describe, expect, it } from "vitest";

import { attr, drawn, parts, rootedViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemIndicator } from "#menu/item-indicator.tsx";
import { Item } from "#menu/item.tsx";
import { grouped, listed } from "#menu/menu.fixtures.tsx";

describe("ItemIndicator", () => {
  it("draws a span inside the row it needs above it", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator>*</ItemIndicator>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemIndicator").tagName).toBe("SPAN");
  });

  it("says the row it marks is on", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-indicator")[0]?.dataset["state"]).toBe("checked");
  });

  it("says the row it marks is off", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-indicator")[1]?.dataset["state"]).toBe("unchecked");
  });

  it("carries no state inside a row that offers no choice", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator>*</ItemIndicator>
        </Item>,
      ),
    );

    expect(attr(container, "item-indicator", "state")).toBeUndefined();
  });

  it("is hidden from a screen reader because the row already reports its state", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator>*</ItemIndicator>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("throws where it is drawn outside a row", () => {
    expect(rootedViolations({ ItemIndicator }, "A part of Menu")).toStrictEqual([]);
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator as="svg" />
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemIndicator").tagName).toBe("svg");
  });
});
