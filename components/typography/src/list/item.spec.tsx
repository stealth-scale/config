import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#list/item.ts";
import { recipe } from "#list/recipe.ts";
import { Root } from "#list/root.ts";

function listed(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Item", () => {
  it("conforms as a list item element inside the root it needs above it", () => {
    expect(
      violations(Item, {
        as: true,
        children: true,
        element: "LI",
        subject: (container) => slotElement(container, "list", "item"),
        wrapper: listed,
      }),
    ).toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Item>One</Item>
            </Root>,
          ).container,
        { slot: "item" },
      ),
    ).toStrictEqual([]);
  });
});
