import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { controlSizes, iconOnly, iconSizes, touchTarget } from "#authoring/recipes/sizes.ts";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

describe("sizes", () => {
  it("reads the four semantic scales for each control size", () => {
    expect(controlSizes(["sm", "md"])).toStrictEqual({
      md: { gap: "gap.md", height: "control.md", paddingInline: "inset.md", textStyle: "label.md" },
      sm: { gap: "gap.sm", height: "control.sm", paddingInline: "inset.sm", textStyle: "label.sm" },
    });
  });

  it("reads the icon scale for each icon size", () => {
    expect(iconSizes(["xs", "xl"])).toStrictEqual({
      xl: { boxSize: "icon.xl" },
      xs: { boxSize: "icon.xs" },
    });
  });

  it("draws a square control with no inset for each icon-only size", () => {
    expect(iconOnly(["md"])).toStrictEqual({ md: { boxSize: "control.md", padding: "0" } });
  });

  it("widens the hit area to a medium control under a coarse pointer alone", () => {
    expect(Object.keys(touchTarget())).toStrictEqual(["_touch"]);
    expect(touchTarget()).toMatchObject({
      _touch: {
        _after: { minBlockSize: "control.md", minInlineSize: "control.md", position: "absolute" },
        position: "relative",
      },
    });
  });

  it("reads tokens the foundation defines at every size of every scale", () => {
    const recipe = defineRecipe({
      base: touchTarget(),
      className: "x",
      variants: { icon: iconSizes(SIZES), only: iconOnly(SIZES), size: controlSizes(SIZES) },
    });

    expect(
      recipeViolations(recipe, {
        skip: {
          "recipe.values": "the three scales share their steps, so one recipe reads them all",
        },
      }),
    ).toStrictEqual([]);
  });
});
