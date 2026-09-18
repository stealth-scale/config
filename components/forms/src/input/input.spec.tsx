import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Input } from "#input/input.ts";
import { recipe } from "#input/recipe.ts";

describe("Input", () => {
  it("conforms as an input element", () => {
    expect(violations(Input, { as: true, element: "INPUT" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule where a caller names it", async () => {
    await expect(
      accessibilityViolations(Input, { props: { "aria-label": "Search invoices" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Input {...props} />).container),
    ).toStrictEqual([]);
  });

  it("keeps the type a caller states", () => {
    const { container } = render(<Input type="email" />);

    expect(recipeElement(container, "input").getAttribute("type")).toBe("email");
  });

  it("is disabled when a caller says so", () => {
    const { container } = render(<Input disabled />);

    expect(recipeElement(container, "input").hasAttribute("disabled")).toBe(true);
  });

  it("marks itself wrong off the attribute a screen reader reads too", () => {
    const { container } = render(<Input aria-invalid />);

    expect(recipeElement(container, "input").getAttribute("aria-invalid")).toBe("true");
  });

  it("draws the element as names", () => {
    const { container } = render(<Input as="textarea" />);

    expect(recipeElement(container, "input").tagName).toBe("TEXTAREA");
  });
});
