import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Mark } from "#mark/mark.ts";
import { recipe } from "#mark/recipe.ts";

describe("Mark", () => {
  it("conforms as a mark element", () => {
    expect(violations(Mark, { as: true, children: true, element: "MARK" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Mark, { props: { children: "hit" } }),
    ).resolves.toStrictEqual([]);
  });

  it("exposes the mark role to a screen reader", () => {
    render(<Mark>hit</Mark>);

    expect(screen.getByRole("mark").textContent).toBe("hit");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Mark {...props}>hit</Mark>).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Mark as="span">hit</Mark>);

    expect(recipeElement(container, "mark").tagName).toBe("SPAN");
  });
});
