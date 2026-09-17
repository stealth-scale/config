import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotClass, slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Item } from "#list/item.ts";
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

  it("draws its slot class and the class of the default look", () => {
    const { container } = render(listed(<Item>One</Item>));

    expect(slotClasses(container, "list", "item")).toStrictEqual([
      slotClass("list", "item"),
      slotVariantClass("list", "item", "variant", "marker"),
    ]);
  });

  it("draws the class of the alignment the root was given", () => {
    const { container } = render(
      <Root align="center">
        <Item>One</Item>
      </Root>,
    );

    expect(slotClasses(container, "list", "item")).toContain(
      slotVariantClass("list", "item", "align", "center"),
    );
  });

  it("draws the class of the motion the root was given", () => {
    const { container } = render(
      <Root motion="rise">
        <Item>One</Item>
      </Root>,
    );

    expect(slotClasses(container, "list", "item")).toContain(
      slotVariantClass("list", "item", "motion", "rise"),
    );
  });

  it("draws no class for the gap because the gap styles the root", () => {
    const { container } = render(
      <Root gap="lg">
        <Item>One</Item>
      </Root>,
    );

    expect(slotClasses(container, "list", "item")).not.toContain(
      slotVariantClass("list", "item", "gap", "lg"),
    );
  });
});
