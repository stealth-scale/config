/**
 * Defines a recipe: how a component draws itself, as the styles of its base, its variants and its
 * compounds, typed against the vocabulary.
 *
 * @remarks
 *   Each definition is an identity function over the compiler's own recipe types, so a recipe
 *   file carries no compiler code and is safe to import from a component at run time and from a
 *   configuration in Node. The types come from the generated runtime, so a value a recipe writes
 *   is checked against the tokens the foundation defines.
 */

import type {
  RecipeDefinition,
  RecipeSelection,
  RecipeVariantRecord,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
} from "#generated/types/recipe.d.mts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { type RecipeRule } from "#pandacss.ts";

/**
 * Describes what a recipe states about itself beyond its styles.
 */
interface Meta {
  /**
   * The prefix of every class the recipe emits.
   */
  className: string;

  /**
   * Why the recipe exists, carried into the generated documentation.
   */
  description?: string;

  /**
   * Every tag that carries the recipe's variant props, as a name or a pattern. Without it only a
   * tag named after the recipe is extracted, and a wrapper under another name draws nothing.
   */
  jsx?: Array<RegExp | string>;

  /**
   * Variants written into the stylesheet whether or not a source file reads them, for the ones a
   * component picks while it runs.
   */
  staticCss?: RecipeRule[];
}

/**
 * Describes a whole recipe for a component that draws one element.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export type Recipe<Variants extends RecipeVariantRecord = RecipeVariantRecord> = Meta &
  RecipeDefinition<Variants>;

/**
 * Describes a whole recipe for a component that draws several parts.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
export type SlotRecipe<
  Slots extends string = string,
  Variants extends SlotRecipeVariantRecord<Slots> = SlotRecipeVariantRecord<Slots>,
> = Meta & SlotRecipeDefinition<Slots, Variants>;

/**
 * Takes the props a recipe lets a caller choose.
 *
 * @remarks
 *   The binding works this out for itself, so a component whose props it types needs nothing
 *   here. A component the binding cannot type, such as a list with a type parameter of its own,
 *   states its own props and takes the choices from here rather than writing them out again.
 * @typeParam Bound - The recipe to read.
 */
export type RecipeProps<Bound> =
  Bound extends SlotRecipe<string, infer Variants>
    ? RecipeSelection<Variants>
    : Bound extends Meta & RecipeDefinition<infer Variants>
      ? RecipeSelection<Variants>
      : never;

/**
 * Returns a recipe for a component that draws one element unchanged, typed.
 *
 * @remarks
 *   `const` keeps the literal values of each variant, which is what the binding types a
 *   component's props from. The compiler's own helper widens them to `string`.
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export function defineRecipe<const Variants extends RecipeVariantRecord>(
  recipe: Recipe<Variants>,
): Recipe<Variants> {
  return recipe;
}

/**
 * Returns a recipe for a component that draws several parts unchanged, typed.
 *
 * @typeParam Slots - Every part the component draws.
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export function defineSlotRecipe<
  const Slots extends string,
  const Variants extends SlotRecipeVariantRecord<Slots>,
>(recipe: SlotRecipe<Slots, Variants>): SlotRecipe<Slots, Variants> {
  return recipe;
}

/**
 * Returns a style object unchanged, typed, for a fragment two recipes share.
 */
export function defineStyles(styles: SystemStyleObject): SystemStyleObject {
  return styles;
}
