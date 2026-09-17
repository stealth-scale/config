import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#spacer/recipe.ts";
import { Spacer } from "#spacer/spacer.ts";

describe("Spacer", () => {
  it("conforms as a div element", () => {
    expect(violations(Spacer, { as: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(accessibilityViolations(Spacer)).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Spacer {...props} />).container),
    ).toStrictEqual([]);
  });

  it("hides empty room from assistive technology", () => {
    const { container } = render(<Spacer />);

    expect(recipeElement(container, "spacer").getAttribute("aria-hidden")).toBe("true");
  });
});
