import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#breadcrumb/item.ts";
import { List } from "#breadcrumb/list.ts";
import { recipe } from "#breadcrumb/recipe.ts";
import { Root } from "#breadcrumb/root.ts";

describe("Root", () => {
  it("conforms as a navigation element", () => {
    expect(violations(Root, { as: true, children: true, element: "NAV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a trail", async () => {
    await expect(
      accessibilityViolations(Root, {
        props: {
          children: (
            <List>
              <Item>Invoices</Item>
            </List>
          ),
        },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("names the landmark so a page of several tells them apart", () => {
    const { container } = render(<Root />);

    expect(slotElement(container, "breadcrumb", "root").getAttribute("aria-label")).toBe(
      "Breadcrumb",
    );
  });

  it("keeps the name a caller states", () => {
    const { container } = render(<Root aria-label="You are here" />);

    expect(slotElement(container, "breadcrumb", "root").getAttribute("aria-label")).toBe(
      "You are here",
    );
  });
});
