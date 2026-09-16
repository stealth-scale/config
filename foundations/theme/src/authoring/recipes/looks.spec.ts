import { describe, expect, it } from "vitest";

import { LOOKS, lookVariants } from "#authoring/recipes/looks.ts";

describe("lookVariants", () => {
  it("lists six looks", () => {
    expect(LOOKS).toHaveLength(6);
  });

  it("reads a layer style for each look it was handed", () => {
    expect(lookVariants(["solid", "outline"])).toStrictEqual({
      outline: { layerStyle: "outline.solid" },
      solid: { layerStyle: "fill.solid" },
    });
  });

  it("reads a fill for every look but the outline", () => {
    expect(lookVariants(LOOKS)).toStrictEqual({
      ghost: { layerStyle: "fill.ghost" },
      outline: { layerStyle: "outline.solid" },
      plain: { layerStyle: "fill.plain" },
      solid: { layerStyle: "fill.solid" },
      subtle: { layerStyle: "fill.subtle" },
      surface: { layerStyle: "fill.surface" },
    });
  });
});
