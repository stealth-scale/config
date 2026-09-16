/**
 * Binds a recipe to the elements that draw it.
 *
 * @remarks
 *   The generated context factories accept a recipe definition, but they compile one atomically:
 *   the classes land in the utilities layer under value-derived names, and a theme's extension
 *   targets the recipe layer under the recipe's own names, so a component bound through a raw
 *   definition could not be extended by a theme. The definition is turned into the compiler's
 *   runtime recipe here first, which is what a config recipe binds through, and the factories are
 *   handed that.
 */

import { type Recipe, type SlotRecipe } from "#authoring/recipe.ts";
import { toVariantMap } from "#generated/helpers.mjs";
import type { RecipeContext } from "#generated/jsx/create-recipe-context.d.mts";
import type { SlotRecipeContext } from "#generated/jsx/create-slot-recipe-context.d.mts";
import {
  createRecipeContext as bindRecipe,
  createSlotRecipeContext as bindSlots,
} from "#generated/jsx/index.mjs";
import {
  createRecipe,
  createSlotRecipe,
  type RecipeRuntimeConfig,
  type SlotRecipeRuntimeConfig,
} from "#generated/recipes/runtime.mjs";
import type {
  RecipeConfigVariantMap,
  RecipeRuntimeFn,
  RecipeSelection,
  RecipeVariantRecord,
  SlotRecipeRuntimeFn,
  SlotRecipeVariantRecord,
} from "#generated/types/recipe.d.mts";

export type { RecipeContext, SlotRecipeContext };

/**
 * Describes the runtime function the generated factory is handed for a recipe that draws one
 * element.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
type Bound<Variants extends RecipeVariantRecord> = RecipeRuntimeFn<
  RecipeSelection<Variants>,
  RecipeConfigVariantMap<Variants>
>;

/**
 * Describes the runtime function the generated factory is handed for a recipe with slots.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
type BoundSlots<
  Slots extends string,
  Variants extends SlotRecipeVariantRecord<Slots>,
> = SlotRecipeRuntimeFn<Slots, RecipeSelection<Variants>, RecipeConfigVariantMap<Variants>>;

/**
 * Maps each variant axis to the values it takes, which is all the runtime reads of the variants.
 *
 * @remarks
 *   The styles under each value are the stylesheet's business and were written into it at build
 *   time. What is left is the naming: which class each value produces.
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
function variantMapOf<Variants extends object>(
  variants: undefined | Variants,
): RecipeConfigVariantMap<Variants> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the generated helper is untyped, and it maps each axis to the keys of its values
  return toVariantMap(variants ?? {}) as RecipeConfigVariantMap<Variants>;
}

/**
 * Reduces a definition to the shape the compiler's runtime builds a function from.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
function toRuntimeConfig<Variants extends RecipeVariantRecord>(
  recipe: Recipe<Variants>,
): RecipeRuntimeConfig<Variants> {
  return {
    className: recipe.className,
    ...(recipe.compoundVariants === undefined ? {} : { compoundVariants: recipe.compoundVariants }),
    ...(recipe.defaultVariants === undefined ? {} : { defaultVariants: recipe.defaultVariants }),
    name: recipe.className,
    variantMap: variantMapOf(recipe.variants),
  };
}

/**
 * Reduces a slot definition to the shape the compiler's runtime builds a function from.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
function toSlotRuntimeConfig<Slots extends string, Variants extends SlotRecipeVariantRecord<Slots>>(
  recipe: SlotRecipe<Slots, Variants>,
): SlotRecipeRuntimeConfig<Slots, Variants> {
  return {
    className: recipe.className,
    ...(recipe.compoundVariants === undefined ? {} : { compoundVariants: recipe.compoundVariants }),
    ...(recipe.defaultVariants === undefined ? {} : { defaultVariants: recipe.defaultVariants }),
    name: recipe.className,
    slots: recipe.slots,
    variantMap: variantMapOf(recipe.variants),
  };
}

/**
 * Binds a recipe that draws one element and returns the element factory and the provider that
 * sets variants from above.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export function createRecipeContext<const Variants extends RecipeVariantRecord>(
  recipe: Recipe<Variants>,
): RecipeContext<Bound<Variants>> {
  return bindRecipe(createRecipe(toRuntimeConfig(recipe)));
}

/**
 * Binds a recipe that draws several parts and returns the three factories a compound component
 * is built from.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
export function createSlotRecipeContext<
  const Slots extends string,
  const Variants extends SlotRecipeVariantRecord<Slots>,
>(recipe: SlotRecipe<Slots, Variants>): SlotRecipeContext<BoundSlots<Slots, Variants>> {
  return bindSlots(createSlotRecipe(toSlotRuntimeConfig(recipe)));
}
