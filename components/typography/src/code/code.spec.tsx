import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Code } from "#code/code.ts";
import { recipe } from "#code/recipe.ts";

describe("Code", () => {
  it("conforms as a code element", () => {
    expect(violations(Code, { as: true, children: true, element: "CODE" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Code, { props: { children: "npm" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Code {...props}>npm</Code>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Code as="kbd">npm</Code>);

    expect(recipeElement(container, "code").tagName).toBe("KBD");
  });
});
