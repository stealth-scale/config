import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Item } from "#breadcrumb/item.ts";

describe("Item", () => {
  it("conforms as a list row inside the landmark it needs above it", () => {
    expect(
      violations(Item, {
        as: true,
        children: true,
        element: "LI",
        subject: (container) => slotElement(container, "breadcrumb", "item"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(trailed(<Item as="span">Invoices</Item>));

    expect(slotElement(container, "breadcrumb", "item").tagName).toBe("SPAN");
  });
});
