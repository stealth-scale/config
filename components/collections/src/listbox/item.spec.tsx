import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#listbox/item.tsx";
import { composed, offered } from "#listbox/listbox.fixtures.tsx";
import { ROWS } from "#listbox/rows.fixtures.ts";

describe("Item", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(offered(<Item item={ROWS[0]} />));

    expect(slotElement(container, "listbox", "item").tagName).toBe("DIV");
  });

  it("carries the option role", () => {
    render(offered(<Item item={ROWS[0]} />));

    expect(screen.getByRole("option")).toBeTruthy();
  });

  it("takes no tab stop, because focus rests on the list", () => {
    render(offered(<Item item={ROWS[0]} />));

    expect(screen.getByRole("option").getAttribute("tabindex")).toBeNull();
  });

  it("reports itself as unchosen until it is picked", () => {
    render(composed());

    expect(screen.getByRole("option", { name: "Invoices" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });

  it("reports itself as chosen once it is pressed", async () => {
    render(composed());
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(screen.getByRole("option", { name: "Invoices" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });
});
