import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Frame } from "#frame/frame.ts";
import { recipe } from "#frame/recipe.ts";

describe("Frame", () => {
  it("conforms as a div element", () => {
    expect(violations(Frame, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a named picture", async () => {
    await expect(
      accessibilityViolations(Frame, {
        props: { children: <img alt="A hillside" src="/hill.avif" /> },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Frame {...props} />).container),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Frame as="figure" />);

    expect(recipeElement(container, "frame").tagName).toBe("FIGURE");
  });
});
