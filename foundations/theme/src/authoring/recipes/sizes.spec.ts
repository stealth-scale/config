import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import {
  below,
  controlSizes,
  iconOnly,
  iconSizes,
  insetSizes,
  tagSizes,
  touchTarget,
} from "#authoring/recipes/sizes.ts";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

describe("sizes", () => {
  it("reads the four semantic scales for each control size", () => {
    expect(controlSizes(["md"])).toMatchObject({
      md: { gap: "gap.md", height: "control.md", paddingInline: "inset.md", textStyle: "label.md" },
    });
  });

  it("leads with one step less inset where a mark opens the control", () => {
    expect(controlSizes(["md", "4xl"])).toMatchObject({
      "4xl": { "&:has(> svg:first-child)": { paddingInlineStart: "inset.3xl" } },
      md: { "&:has(> svg:first-child)": { paddingInlineStart: "inset.sm" } },
    });
  });

  it("leads with its own inset at the smallest size", () => {
    expect(controlSizes(["xs"])).toMatchObject({
      xs: { "&:has(> svg:first-child)": { paddingInlineStart: "inset.xs" } },
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
        _before: { minBlockSize: "control.md", minInlineSize: "control.md", position: "absolute" },
        position: "relative",
      },
    });
  });

  it("pads every side of a box on the inset scale", () => {
    expect(insetSizes(["md"])).toStrictEqual({ md: { padding: "inset.md" } });
  });

  it("offers every step of the inset scale where a recipe names none", () => {
    expect(Object.keys(insetSizes())).toHaveLength(8);
  });

  it("reads the step below the one it is given", () => {
    expect(below("4xl")).toBe("3xl");
    expect(below("md")).toBe("sm");
  });

  it("reads the smallest step as itself because nothing lies below it", () => {
    expect(below("xs")).toBe("xs");
  });

  it("reads the tag scale for a tag's height and the step below for the rest", () => {
    expect(tagSizes(["md"])).toStrictEqual({
      md: { gap: "gap.sm", height: "tag.md", paddingInline: "inset.sm", textStyle: "label.sm" },
    });
  });

  it("offers every step where a recipe names none", () => {
    expect(Object.keys(tagSizes()).toSorted()).toStrictEqual(
      Object.keys(controlSizes()).toSorted(),
    );
  });

  it("reads tokens the foundation defines at every size of every scale", () => {
    const recipe = defineRecipe({
      base: touchTarget(),
      className: "x",
      variants: {
        icon: iconSizes(SIZES),
        only: iconOnly(SIZES),
        size: controlSizes(SIZES),
        tag: tagSizes(SIZES),
      },
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
