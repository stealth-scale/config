import { describe, expect, expectTypeOf, it } from "vitest";

import * as extension from "#authoring/extension.ts";

describe("RecipeExtension", () => {
  it("exports nothing at run time and refuses the two keys a component owns", () => {
    expect(Object.keys(extension)).toStrictEqual([]);

    expectTypeOf<{ className: string }>().not.toExtend<extension.RecipeExtension>();
    expectTypeOf<{ slots: string[] }>().not.toExtend<extension.SlotRecipeExtension>();
    expectTypeOf<{ base: { fontWeight: "bold" } }>().toExtend<extension.RecipeExtension>();
  });
});
