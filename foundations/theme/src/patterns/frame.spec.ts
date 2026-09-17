import { describe, expect, it } from "vitest";

import { recipeViolations } from "@stealthscale/testing-theme";

import { defineRecipe } from "#authoring/recipe.ts";
import { frame } from "#patterns/frame.ts";

describe("frame", () => {
  it("draws a landscape frame when nothing is stated", () => {
    expect(frame()).toMatchObject({ aspectRatio: "landscape", overflow: "hidden" });
  });

  it("covers the frame with the media inside it", () => {
    expect(frame()).toMatchObject({
      "& > img, & > video": { blockSize: "100%", inlineSize: "100%", objectFit: "cover" },
    });
  });

  it("takes the ratio it was given", () => {
    expect(frame({ ratio: "square" })).toMatchObject({ aspectRatio: "square" });
  });

  it("passes the recipe checks", () => {
    expect(recipeViolations(defineRecipe({ base: frame(), className: "x" }))).toStrictEqual([]);
  });
});
