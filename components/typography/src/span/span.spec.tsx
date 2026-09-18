import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { recipe } from "#span/recipe.ts";
import { Span } from "#span/span.ts";

describe("Span", () => {
  it("conforms as a span element", () => {
    expect(violations(Span, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Span, { props: { children: "a run" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Span {...props}>a run</Span>).container),
    ).toStrictEqual([]);
  });

  it("writes no class of its own when nothing is picked", () => {
    const { container } = render(<Span>a run</Span>);

    expect([...recipeElement(container, "span").classList]).toStrictEqual(["span"]);
  });

  it("writes the truncate class when a caller cuts the run", () => {
    const { container } = render(<Span truncate>a long run</Span>);

    expect([...recipeElement(container, "span").classList]).toContain(
      variantClass("span", "truncate", "true"),
    );
  });

  it("draws the element as names", () => {
    const { container } = render(<Span as="i">a run</Span>);

    expect(recipeElement(container, "span").tagName).toBe("I");
  });
});
