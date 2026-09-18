import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#stack/recipe.ts";
import { Stack } from "#stack/stack.ts";

describe("Stack", () => {
  it("conforms as a div element", () => {
    expect(violations(Stack, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a paragraph", async () => {
    await expect(
      accessibilityViolations(Stack, { props: { children: <p>One</p> } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Stack {...props}>One</Stack>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Stack as="ul">One</Stack>);

    expect(recipeElement(container, "stack").tagName).toBe("UL");
  });
});
