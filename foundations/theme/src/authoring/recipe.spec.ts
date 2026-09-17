import { describe, expect, expectTypeOf, it } from "vitest";

import {
  compoundClassName,
  compoundSelection,
  defineRecipe,
  defineSlotRecipe,
  defineStyles,
  type RecipeProps,
} from "#authoring/recipe.ts";

const AXES = {
  disabled: { false: {}, true: {} },
  level: { 1: {}, 2: {} },
  size: { lg: {}, md: {} },
  variant: { ghost: {}, solid: {} },
};

function named(compound: object): string | undefined {
  return defineRecipe({
    className: "button",
    compoundVariants: [{ css: {}, ...compound }],
    variants: AXES,
  }).compoundVariants?.[0]?.className;
}

describe("defineRecipe", () => {
  it("returns the recipe it was handed when it has no compounds", () => {
    const recipe = { base: { color: "fg" }, className: "button" };

    expect(defineRecipe(recipe)).toBe(recipe);
  });

  it("names a compound from the sorted axes it matches on", () => {
    expect(named({ size: "lg", variant: "solid" })).toBe(
      "button--compound__size_lg__variant_solid",
    );
  });

  it("writes the values an axis may hold joined by a bar", () => {
    expect(named({ variant: ["ghost", "solid"] })).toBe("button--compound__variant_ghost|solid");
  });

  it("writes a boolean and a number the way the compiler does", () => {
    expect(named({ disabled: true })).toBe("button--compound__disabled_true");
    expect(named({ level: 2 })).toBe("button--compound__level_2");
  });

  it("keeps the styles and the selection of a named compound", () => {
    const recipe = defineRecipe({
      className: "button",
      compoundVariants: [{ css: { fontWeight: "bold" }, size: "lg" }],
      variants: AXES,
    });

    expect(recipe.compoundVariants).toStrictEqual([
      { className: "button--compound__size_lg", css: { fontWeight: "bold" }, size: "lg" },
    ]);
  });

  it("throws when a compound matches an axis on a value a class name cannot carry", () => {
    expect(() => compoundClassName("button", { size: { lg: true } })).toThrow(
      "size is matched on a object, which a class name cannot carry",
    );
  });

  it("writes the selection a compound matches on without a class before it", () => {
    expect(compoundSelection({ css: {}, size: "lg", variant: "solid" })).toBe(
      "size_lg__variant_solid",
    );
    expect(compoundSelection({ css: {}, size: ["lg", "md"] })).toBe("size_lg|md");
  });

  it("returns nothing for a selection a class name cannot carry", () => {
    expect(compoundSelection({ css: {}, size: { lg: true } })).toBeUndefined();
    expect(compoundSelection({ css: {}, size: ["lg", { md: true }] })).toBeUndefined();
  });

  it("splits a slot compound into one named compound per slot it styles", () => {
    const recipe = defineSlotRecipe({
      className: "card",
      compoundVariants: [
        { css: { root: { fontWeight: "bold" }, title: { letterSpacing: "wide" } }, size: "lg" },
      ],
      slots: ["root", "title"],
      variants: { size: { lg: {}, md: {} } },
    });

    expect(recipe.compoundVariants).toStrictEqual([
      {
        className: "card__root--compound__size_lg",
        css: { root: { fontWeight: "bold" } },
        size: "lg",
      },
      {
        className: "card__title--compound__size_lg",
        css: { title: { letterSpacing: "wide" } },
        size: "lg",
      },
    ]);
  });

  it("keeps the literal values of each variant", () => {
    const recipe = defineRecipe({
      className: "button",
      variants: { variant: { ghost: {}, solid: {} } },
    });

    expect(Object.keys(recipe.variants?.variant ?? {}).toSorted()).toStrictEqual([
      "ghost",
      "solid",
    ]);

    expectTypeOf<RecipeProps<typeof recipe>["variant"]>().toEqualTypeOf<
      "ghost" | "solid" | undefined
    >();
  });

  it("returns the slot recipe it was handed when it has no compounds", () => {
    const recipe = { className: "dialog", slots: ["content", "title"] };

    expect(defineSlotRecipe(recipe)).toBe(recipe);
  });

  it("keeps the slots a slot recipe was given", () => {
    const recipe = defineSlotRecipe({ className: "dialog", slots: ["content", "title"] });

    expect(recipe.slots).toStrictEqual(["content", "title"]);
  });

  it("takes the props of a slot recipe from its variants", () => {
    const recipe = defineSlotRecipe({
      className: "dialog",
      slots: ["content"],
      variants: { size: { lg: {}, md: {} } },
    });

    expect(recipe.className).toBe("dialog");

    expectTypeOf<RecipeProps<typeof recipe>["size"]>().toEqualTypeOf<"lg" | "md" | undefined>();
  });

  it("returns the styles it was handed", () => {
    const styles = { color: "fg" };

    expect(defineStyles(styles)).toBe(styles);
  });
});
