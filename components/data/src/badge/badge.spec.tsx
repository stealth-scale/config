import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Badge } from "#badge/badge.ts";
import { recipe } from "#badge/recipe.ts";

describe("Badge", () => {
  it("conforms as a span element", () => {
    expect(violations(Badge, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Badge, { props: { children: "New" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Badge {...props}>New</Badge>).container),
    ).toStrictEqual([]);
  });

  it("carries no role of its own so a caller decides what it is", () => {
    const { container } = render(<Badge>New</Badge>);

    expect(recipeElement(container, "badge").hasAttribute("role")).toBe(false);
  });

  it("keeps the name a caller writes for a badge whose meaning is in its colour", () => {
    const { container } = render(<Badge aria-label="3 failed">3</Badge>);

    expect(recipeElement(container, "badge").getAttribute("aria-label")).toBe("3 failed");
  });

  it("draws the element as names", () => {
    const { container } = render(<Badge as="output">3</Badge>);

    expect(recipeElement(container, "badge").tagName).toBe("OUTPUT");
  });
});
