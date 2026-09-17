import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Heading } from "#heading/heading.ts";

describe("Heading", () => {
  it("conforms as a second-level heading element", () => {
    expect(violations(Heading, { as: true, children: true, element: "H2" })).toStrictEqual([]);
  });

  it("draws the recipe's class and the class of the default size", () => {
    const { container } = render(<Heading>Title</Heading>);

    expect(recipeClasses(container, "heading")).toStrictEqual([
      "heading",
      variantClass("heading", "size", "lg"),
    ]);
  });

  it("draws the class of the size a caller picks", () => {
    const { container } = render(<Heading size="2xl">Title</Heading>);

    expect(recipeClasses(container, "heading")).toContain(variantClass("heading", "size", "2xl"));
  });

  it("draws the class of the effect a caller picks", () => {
    const { container } = render(<Heading effect="shine">Title</Heading>);

    expect(recipeClasses(container, "heading")).toContain(
      variantClass("heading", "effect", "shine"),
    );
  });

  it("draws the class of the motion a caller picks", () => {
    const { container } = render(<Heading motion="reveal">Title</Heading>);

    expect(recipeClasses(container, "heading")).toContain(
      variantClass("heading", "motion", "reveal"),
    );
  });

  it("draws the class of the tone a caller picks", () => {
    const { container } = render(<Heading tone="muted">Title</Heading>);

    expect(recipeClasses(container, "heading")).toContain(variantClass("heading", "tone", "muted"));
  });

  it("draws the level as names", () => {
    const { container } = render(<Heading as="h1">Title</Heading>);

    expect(recipeElement(container, "heading").tagName).toBe("H1");
  });
});
