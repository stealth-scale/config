import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, parts, rootedViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemText } from "#menu/item-text.tsx";
import { Item } from "#menu/item.tsx";
import { grouped, listed } from "#menu/menu.fixtures.tsx";

describe("ItemText", () => {
  it("draws a span inside the row it needs above it", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemText>Rename</ItemText>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemText").tagName).toBe("SPAN");
  });

  it("reads the row above it rather than taking its name again", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemradio", { name: "Comfortable" }).textContent).toContain(
      "Comfortable",
    );
  });

  it("says the row it labels is on", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-text")[0]?.dataset["state"]).toBe("checked");
  });

  it("says the row it labels is off", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-text")[1]?.dataset["state"]).toBe("unchecked");
  });

  it("throws where it is drawn outside a row", () => {
    expect(rootedViolations({ ItemText }, "A part of Menu")).toStrictEqual([]);
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemText as="strong">Rename</ItemText>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemText").tagName).toBe("STRONG");
  });
});
