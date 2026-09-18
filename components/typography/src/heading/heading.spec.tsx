import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Heading } from "#heading/heading.ts";
import { recipe } from "#heading/recipe.ts";

describe("Heading", () => {
  it("conforms as a second-level heading element", () => {
    expect(violations(Heading, { as: true, children: true, element: "H2" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Heading, { props: { children: "Title" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Heading {...props}>Title</Heading>).container),
    ).toStrictEqual([]);
  });

  it("draws the level as names", () => {
    const { container } = render(<Heading as="h1">Title</Heading>);

    expect(recipeElement(container, "heading").tagName).toBe("H1");
  });
});
