import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#list/item.ts";
import { recipe } from "#list/recipe.ts";
import { Root } from "#list/root.ts";

describe("Root", () => {
  it("conforms as a list element", () => {
    expect(violations(Root, { as: true, children: true, element: "UL" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding an entry", async () => {
    await expect(
      accessibilityViolations(Root, { props: { children: <Item>One</Item> } }),
    ).resolves.toStrictEqual([]);
  });

  it("states the list role so a reader counts entries whose markers are gone", () => {
    const { container } = render(<Root />);

    expect(recipeElement(container, "list").getAttribute("role")).toBe("list");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Root as="ol" />);

    expect(slotElement(container, "list", "root").tagName).toBe("OL");
  });
});
