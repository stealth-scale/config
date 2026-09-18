import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { recipe } from "#visually-hidden/recipe.ts";
import { VisuallyHidden } from "#visually-hidden/visually-hidden.ts";

describe("VisuallyHidden", () => {
  it("conforms as a span element", () => {
    expect(violations(VisuallyHidden, { as: true, children: true, element: "SPAN" })).toStrictEqual(
      [],
    );
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(VisuallyHidden, { props: { children: "Loading" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props) => render(<VisuallyHidden {...props}>Loading</VisuallyHidden>).container,
      ),
    ).toStrictEqual([]);
  });

  it("leaves its words where a screen reader reads them", () => {
    const { getByText } = render(<VisuallyHidden>Loading</VisuallyHidden>);

    expect(getByText("Loading").getAttribute("aria-hidden")).toBeNull();
  });

  it("draws the element as names", () => {
    const { container } = render(<VisuallyHidden as="h2">Sections</VisuallyHidden>);

    expect(recipeElement(container, "visually-hidden").tagName).toBe("H2");
  });
});
