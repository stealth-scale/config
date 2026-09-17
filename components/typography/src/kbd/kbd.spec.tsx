import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Kbd } from "#kbd/kbd.ts";

describe("Kbd", () => {
  it("conforms as a kbd element", () => {
    expect(violations(Kbd, { as: true, children: true, element: "KBD" })).toStrictEqual([]);
  });

  it("draws the recipe's class and the classes of the default variants", () => {
    const { container } = render(<Kbd>Esc</Kbd>);

    expect(recipeClasses(container, "kbd")).toStrictEqual([
      "kbd",
      variantClass("kbd", "size", "md"),
      variantClass("kbd", "variant", "raised"),
    ]);
  });

  it("draws the class of the look a caller picks", () => {
    const { container } = render(<Kbd variant="outline">Esc</Kbd>);

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "variant", "outline"));
  });

  it("draws the class of the size a caller picks", () => {
    const { container } = render(<Kbd size="lg">Esc</Kbd>);

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "size", "lg"));
  });

  it("draws the class of the status a caller picks", () => {
    const { container } = render(<Kbd status="warning">Esc</Kbd>);

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "status", "warning"));
  });

  it("draws the element as names", () => {
    const { container } = render(<Kbd as="span">Esc</Kbd>);

    expect(recipeElement(container, "kbd").tagName).toBe("SPAN");
  });
});
