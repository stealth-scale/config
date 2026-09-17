import { render } from "@testing-library/react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { IconButton, type IconButtonProps } from "#button/icon-button.ts";
import { recipe } from "#button/recipe.ts";

const NAMED = { "aria-label": "Close" };

describe("IconButton", () => {
  it("conforms as a button element", () => {
    expect(
      violations(IconButton, { as: true, children: true, element: "BUTTON", props: NAMED }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a glyph", async () => {
    await expect(
      accessibilityViolations(IconButton, {
        props: { ...NAMED, children: <svg aria-hidden="true" /> },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<IconButton {...NAMED} {...props} />).container, {
        defaults: { shape: "square" },
      }),
    ).toStrictEqual([]);
  });

  it("draws the square shape when nothing is picked", () => {
    const { container } = render(<IconButton {...NAMED} />);

    expect(recipeClasses(container, "button")).toContain(variantClass("button", "shape", "square"));
  });

  it("requires an accessible name", () => {
    expectTypeOf<{ "aria-label": string }>().toExtend<IconButtonProps>();
    expectTypeOf<{ "aria-labelledby": string }>().toExtend<IconButtonProps>();
    expectTypeOf<{ children: string }>().not.toExtend<IconButtonProps>();
    expect(IconButton).toBeDefined();
  });
});
