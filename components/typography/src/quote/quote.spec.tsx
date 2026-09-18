import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Quote } from "#quote/quote.ts";
import { recipe } from "#quote/recipe.ts";

describe("Quote", () => {
  it("conforms as a q element", () => {
    expect(violations(Quote, { as: true, children: true, element: "Q" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Quote, { props: { children: "quoted" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Quote {...props}>quoted</Quote>).container),
    ).toStrictEqual([]);
  });

  it("keeps the cite a caller states so a reader can reach the source", () => {
    const { container } = render(<Quote cite="https://example.org/paper">quoted</Quote>);

    expect(recipeElement(container, "quote").getAttribute("cite")).toBe(
      "https://example.org/paper",
    );
  });

  it("draws the element as names", () => {
    const { container } = render(<Quote as="span">quoted</Quote>);

    expect(recipeElement(container, "quote").tagName).toBe("SPAN");
  });
});
