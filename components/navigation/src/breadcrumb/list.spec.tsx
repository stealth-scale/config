import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Item } from "#breadcrumb/item.ts";
import { List } from "#breadcrumb/list.ts";

describe("List", () => {
  it("conforms as an ordered list inside the landmark it needs above it", () => {
    expect(
      violations(List, {
        as: true,
        children: true,
        element: "OL",
        subject: (container) => slotElement(container, "breadcrumb", "list"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a crumb", async () => {
    await expect(
      accessibilityViolations(List, {
        props: { children: <Item>Invoices</Item> },
        wrapper: trailed,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("states its list role because a list with no marker loses it in Safari", () => {
    const { container } = render(trailed(<List />));

    expect(slotElement(container, "breadcrumb", "list").getAttribute("role")).toBe("list");
  });
});
