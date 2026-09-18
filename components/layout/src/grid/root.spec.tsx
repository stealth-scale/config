import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#grid/item.ts";
import { recipe } from "#grid/recipe.ts";
import { Root } from "#grid/root.ts";

describe("Root", () => {
  it("conforms as a div element", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding an entry", async () => {
    await expect(
      accessibilityViolations(Root, { props: { children: <Item>One</Item> } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Root as="ul" />);

    expect(slotElement(container, "grid", "root").tagName).toBe("UL");
  });
});
