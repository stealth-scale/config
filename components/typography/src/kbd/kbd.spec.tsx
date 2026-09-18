import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Kbd } from "#kbd/kbd.ts";
import { recipe } from "#kbd/recipe.ts";

describe("Kbd", () => {
  it("conforms as a kbd element", () => {
    expect(violations(Kbd, { as: true, children: true, element: "KBD" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Kbd, { props: { children: "Esc" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Kbd {...props}>Esc</Kbd>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Kbd as="span">Esc</Kbd>);

    expect(recipeElement(container, "kbd").tagName).toBe("SPAN");
  });
});
