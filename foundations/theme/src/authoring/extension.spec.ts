import { describe, expect, expectTypeOf, it } from "vitest";

import * as extension from "#authoring/extension.ts";

describe("RecipeExtension", () => {
  it("exports nothing at run time and refuses the two keys a component owns", () => {
    expect(Object.keys(extension)).toStrictEqual([]);

    expectTypeOf<{ className: string }>().not.toExtend<extension.RecipeExtension>();
    expectTypeOf<{ slots: string[] }>().not.toExtend<extension.SlotRecipeExtension>();
    expectTypeOf<{ base: { fontWeight: "bold" } }>().toExtend<extension.RecipeExtension>();
  });

  it("takes a compound matched on axes it knows by name alone", () => {
    expect(Object.keys(extension)).toStrictEqual([]);

    expectTypeOf<{
      compoundVariants: Array<{ css: { fontWeight: "bold" }; size: "lg"; variant: string[] }>;
    }>().toExtend<extension.RecipeExtension>();
    expectTypeOf<{
      compoundVariants: Array<{ css: { root: { fontWeight: "bold" } }; open: true }>;
    }>().toExtend<extension.SlotRecipeExtension>();
    expectTypeOf<{
      compoundVariants: Array<{ className: string; css: { fontWeight: "bold" } }>;
    }>().not.toExtend<extension.RecipeExtension>();
  });
});
