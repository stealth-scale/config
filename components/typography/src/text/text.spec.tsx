import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#text/recipe.ts";
import { Text } from "#text/text.ts";

describe("Text", () => {
  it("conforms as a paragraph element", () => {
    expect(violations(Text, { as: true, children: true, element: "P" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Text, { props: { children: "Words" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Text {...props}>Words</Text>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Text as="span">Words</Text>);

    expect(recipeElement(container, "text").tagName).toBe("SPAN");
  });
});
