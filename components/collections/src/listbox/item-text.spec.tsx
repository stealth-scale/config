import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { ItemText } from "#listbox/item-text.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";
import { ROWS } from "#listbox/rows.fixtures.ts";

describe("ItemText", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(offered(<ItemText item={ROWS[0]}>Invoices</ItemText>));

    expect(slotElement(container, "listbox", "itemText").tagName).toBe("SPAN");
  });

  it("gives a row the words a screen reader announces it by", () => {
    render(offered(<ItemText item={ROWS[0]}>Invoices</ItemText>));

    expect(screen.getByText("Invoices")).toBeTruthy();
  });
});
