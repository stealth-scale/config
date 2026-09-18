import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#skeleton/recipe.ts";
import { Skeleton } from "#skeleton/skeleton.ts";

describe("Skeleton", () => {
  it("conforms as a div element", () => {
    expect(violations(Skeleton, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(accessibilityViolations(Skeleton)).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Skeleton {...props} />).container),
    ).toStrictEqual([]);
  });

  it("carries no role so a screen reader is told once by the region rather than by each bar", () => {
    const { container } = render(<Skeleton />);

    expect(recipeElement(container, "skeleton").hasAttribute("role")).toBe(false);
  });

  it("takes the box of whatever it wraps", () => {
    const { container } = render(
      <Skeleton>
        <p>Words that have not arrived</p>
      </Skeleton>,
    );

    expect(recipeElement(container, "skeleton").textContent).toBe("Words that have not arrived");
  });

  it("draws the element as names", () => {
    const { container } = render(<Skeleton as="span" />);

    expect(recipeElement(container, "skeleton").tagName).toBe("SPAN");
  });
});
