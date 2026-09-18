import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Button } from "#button/button.ts";
import { recipe } from "#button/recipe.ts";

describe("Button", () => {
  it("conforms as a button element", () => {
    expect(violations(Button, { as: true, children: true, element: "BUTTON" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Button, { props: { children: "Save" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Button {...props}>Save</Button>).container),
    ).toStrictEqual([]);
  });

  it("defaults type to button", () => {
    const { container } = render(<Button>Save</Button>);

    expect(recipeElement(container, "button").getAttribute("type")).toBe("button");
  });

  it("keeps the type a caller states", () => {
    const { container } = render(<Button type="submit">Save</Button>);

    expect(recipeElement(container, "button").getAttribute("type")).toBe("submit");
  });

  it("is disabled when a caller says so", () => {
    const { container } = render(<Button disabled>Save</Button>);

    expect(recipeElement(container, "button").hasAttribute("disabled")).toBe(true);
  });

  it("draws the element as names", () => {
    const { container } = render(<Button as="a">Save</Button>);

    expect(recipeElement(container, "button").tagName).toBe("A");
  });
});
