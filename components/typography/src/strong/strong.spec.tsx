import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#strong/recipe.ts";
import { Strong } from "#strong/strong.ts";

describe("Strong", () => {
  it("conforms as a strong element", () => {
    expect(violations(Strong, { as: true, children: true, element: "STRONG" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Strong, { props: { children: "important" } }),
    ).resolves.toStrictEqual([]);
  });

  it("exposes the strong role to a screen reader", () => {
    render(<Strong>important</Strong>);

    expect(screen.getByRole("strong").textContent).toBe("important");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Strong {...props}>important</Strong>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Strong as="b">Widget</Strong>);

    expect(recipeElement(container, "strong").tagName).toBe("B");
  });
});
