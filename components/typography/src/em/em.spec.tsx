import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Em } from "#em/em.ts";
import { recipe } from "#em/recipe.ts";

describe("Em", () => {
  it("conforms as an em element", () => {
    expect(violations(Em, { as: true, children: true, element: "EM" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Em, { props: { children: "stressed" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Em {...props}>stressed</Em>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Em as="i">Beagle</Em>);

    expect(recipeElement(container, "em").tagName).toBe("I");
  });
});
