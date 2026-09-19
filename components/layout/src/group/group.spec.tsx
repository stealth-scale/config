import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Group } from "#group/group.ts";
import { recipe } from "#group/recipe.ts";

describe("Group", () => {
  it("conforms as a div element", () => {
    expect(violations(Group, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding two buttons", async () => {
    await expect(
      accessibilityViolations(Group, {
        props: {
          children: [
            <button key="one" type="button">
              One
            </button>,
            <button key="two" type="button">
              Two
            </button>,
          ],
        },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Group {...props}>One</Group>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Group as="fieldset">One</Group>);

    expect(recipeElement(container, "group").tagName).toBe("FIELDSET");
  });
});
