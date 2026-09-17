/**
 * Defines a recipe: how a component draws itself, as the styles of its base, its variants and its
 * compounds, typed against the vocabulary.
 *
 * @remarks
 *   Each definition returns the recipe typed over the compiler's own recipe types, so a recipe file
 *   carries no compiler code and is safe to import from a component at run time and from a
 *   configuration in Node. The types come from the generated runtime, so a value a recipe writes is
 *   checked against the tokens the foundation defines. A compound is named here, because the
 *   compiler emits its styles under the class the recipe states and the runtime reads the same name
 *   from the same object.
 */

import type {
  RecipeCompoundSelection,
  RecipeSelection,
  RecipeVariantRecord,
  SlotRecipeVariantRecord,
  SlotRecord,
} from "#generated/types/recipe.d.mts";
import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { type RecipeRule } from "#pandacss.ts";
import { recordOf } from "#record.ts";

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
 * Carries the class a compound's styles are emitted under.
 */
interface Named {
  /**
   * The class name. `defineRecipe` and `defineSlotRecipe` write it from the values the compound
   * matches on, and the compiler emits the compound's styles under it.
   */
  className?: string | undefined;
}

/**
 * Carries the styles of a compound that draws one element.
 */
interface Styled {
  /**
   * The styles that apply where every axis the compound names matches.
   */
  css: SystemStyleObject;
}

/**
 * Carries the styles of a compound that draws several parts, by slot.
 *
 * @typeParam Slots - Every part the recipe styles.
 */
interface SlotStyled<Slots extends string> {
  /**
   * The styles that apply where every axis the compound names matches, keyed by slot.
   */
  css: SlotRecord<Slots, SystemStyleObject>;
}

/**
 * Describes one compound of a recipe that draws one element: the values it matches on, the class
 * its styles are emitted under, and the styles.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export type Compound<Variants extends RecipeVariantRecord> = Named &
  RecipeCompoundSelection<Variants> &
  Styled;

/**
 * Describes one compound of a recipe that draws several parts.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
export type SlotCompound<
  Slots extends string,
  Variants extends SlotRecipeVariantRecord<Slots>,
> = Named & RecipeCompoundSelection<Variants> & SlotStyled<Slots>;

/**
 * Describes a whole recipe for a component that draws one element.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export interface Recipe<Variants extends RecipeVariantRecord = RecipeVariantRecord> extends Meta {
  /**
   * The styles every instance is drawn with.
   */
  base?: SystemStyleObject | undefined;

  /**
   * The styles that apply where a combination of values matches, each under a class of its own.
   */
  compoundVariants?: Array<Compound<Variants>> | undefined;

  /**
   * The value of each axis where a caller picks none.
   */
  defaultVariants?: RecipeSelection<Variants> | undefined;

  /**
   * Each axis the recipe offers, against the values it takes and the styles of each value.
   */
  variants?: undefined | Variants;
}

/**
 * Describes a whole recipe for a component that draws several parts.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
export interface SlotRecipe<
  Slots extends string = string,
  Variants extends SlotRecipeVariantRecord<Slots> = SlotRecipeVariantRecord<Slots>,
> extends Meta {
  /**
   * The styles every instance is drawn with, keyed by slot.
   */
  base?: SlotRecord<Slots, SystemStyleObject> | undefined;

  /**
   * The styles that apply where a combination of values matches, each under a class of its own
   * per slot it styles.
   */
  compoundVariants?: Array<SlotCompound<Slots, Variants>> | undefined;

  /**
   * The value of each axis where a caller picks none.
   */
  defaultVariants?: RecipeSelection<Variants> | undefined;

  /**
   * Every part the recipe styles.
   */
  slots: Slots[];

  /**
   * Each axis the recipe offers, against the values it takes and the styles of each value by slot.
   */
  variants?: undefined | Variants;
}

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
    : Bound extends Recipe<infer Variants>
      ? RecipeSelection<Variants>
      : never;

/**
 * Fixes the character the compiler writes between an axis and its value in a class name.
 *
 * @remarks
 *   The build plugin configures the compiler with the same character, so a class the runtime
 *   writes and a selector the stylesheet carries agree. A hyphen rather than the compiler's
 *   default underscore, so `button--size-lg` reads as one modifier.
 */
export const SEPARATOR = "-";

/**
 * Fixes what the compiler writes between a class and the selection a compound matches on.
 */
const COMPOUND = "--compound__";

/**
 * Lists the two keys of a compound that are not axes.
 */
const UNMATCHED = new Set(["className", "css"]);

/**
 * Writes one value a compound matches on the way a class name carries it, or nothing where a
 * class name cannot carry it.
 *
 * @remarks
 *   An array is the values the axis may hold, joined by a bar.
 */
function written(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const each = value.map((one: unknown) => written(one));

    return each.includes(undefined) ? undefined : each.join("|");
  }

  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? String(value)
    : undefined;
}

/**
 * Lists the axes a compound matches on, sorted, against the value each is matched on.
 */
function matched(compound: object): ReadonlyArray<readonly [axis: string, value: unknown]> {
  return Object.keys(compound)
    .filter((axis) => !UNMATCHED.has(axis))
    .toSorted()
    .map((axis) => [axis, Reflect.get(compound, axis)] as const);
}

/**
 * Writes the selection a compound matches on, in the scheme the compiler names it by, or nothing
 * where a class name cannot carry one of the values.
 *
 * @remarks
 *   The axes sorted, each written as the axis, the separator and the value, with a list joined by
 *   a bar and the pairs joined by two underscores. A reader that has a compound and wants the name
 *   the compiler gave it asks for this rather than taking a class apart.
 * @param compound - The compound, read for every key but `css` and `className`.
 */
export function compoundSelection(compound: object): string | undefined {
  const pairs = matched(compound).map(([axis, value]) => {
    const one = written(value);

    return one === undefined ? undefined : `${axis}${SEPARATOR}${one}`;
  });

  return pairs.includes(undefined) ? undefined : pairs.join("__");
}

/**
 * Writes the class a compound's styles are emitted under, from the recipe's class and the values
 * the compound matches on.
 *
 * @remarks
 *   The scheme is the compiler's own, so a theme's compound for the same selection, which the
 *   compiler names itself, is emitted under the same class.
 * @param className - The class of the recipe, or of the slot for a slot recipe.
 * @param compound - The compound, read for every key but `css` and `className`.
 * @throws {@link Error} When the compound matches an axis on a value a class name cannot carry.
 */
export function compoundClassName(className: string, compound: object): string {
  const pairs = matched(compound).map(([axis, value]) => {
    const one = written(value);

    if (one === undefined) {
      throw new Error(`${axis} is matched on a ${typeof value}, which a class name cannot carry`);
    }

    return `${axis}${SEPARATOR}${one}`;
  });

  return `${className}${COMPOUND}${pairs.join("__")}`;
}

/**
 * Returns a compound with the class its styles are emitted under.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
function named<Variants extends RecipeVariantRecord>(
  className: string,
  compound: Compound<Variants>,
): Compound<Variants> {
  return { ...compound, className: compoundClassName(className, compound) };
}

/**
 * Returns a compound restricted to one slot, with the class its styles are emitted under for that
 * slot.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
function forSlot<Slots extends string, Variants extends SlotRecipeVariantRecord<Slots>>(
  className: string,
  slot: Slots,
  compound: SlotCompound<Slots, Variants>,
  styles: SystemStyleObject,
): SlotCompound<Slots, Variants> {
  return {
    ...compound,
    className: compoundClassName(`${className}__${slot}`, compound),
    css: recordOf([slot], () => styles),
  };
}

/**
 * Splits a compound into one per slot it styles, each named for that slot.
 *
 * @remarks
 *   The compiler takes one class per compound and applies it to every slot the compound styles, so
 *   a compound that styled two slots under one class would draw each slot's declarations on the
 *   other. One compound per slot gives each slot a class of its own.
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
function split<Slots extends string, Variants extends SlotRecipeVariantRecord<Slots>>(
  className: string,
  slots: readonly Slots[],
  compound: SlotCompound<Slots, Variants>,
): Array<SlotCompound<Slots, Variants>> {
  return slots.flatMap((slot) => {
    const styles = compound.css[slot];

    return styles === undefined ? [] : [forSlot(className, slot, compound, styles)];
  });
}

/**
 * Returns a recipe for a component that draws one element, typed, with every compound named.
 *
 * @remarks
 *   `const` keeps the literal values of each variant, which is what the binding types a
 *   component's props from. The compiler's own helper widens them to `string`. A recipe without
 *   compounds is returned as it was handed.
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export function defineRecipe<const Variants extends RecipeVariantRecord>(
  recipe: Recipe<Variants>,
): Recipe<Variants> {
  const { compoundVariants } = recipe;

  if (compoundVariants === undefined) return recipe;

  return {
    ...recipe,
    compoundVariants: compoundVariants.map((compound) => named(recipe.className, compound)),
  };
}

/**
 * Returns a recipe for a component that draws several parts, typed, with every compound split per
 * slot it styles and named.
 *
 * @typeParam Slots - Every part the component draws.
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export function defineSlotRecipe<
  const Slots extends string,
  const Variants extends SlotRecipeVariantRecord<Slots>,
>(recipe: SlotRecipe<Slots, Variants>): SlotRecipe<Slots, Variants> {
  const { compoundVariants } = recipe;

  if (compoundVariants === undefined) return recipe;

  return {
    ...recipe,
    compoundVariants: compoundVariants.flatMap((compound) =>
      split(recipe.className, recipe.slots, compound),
    ),
  };
}

/**
 * Returns a style object unchanged, typed, for a fragment two recipes share.
 */
export function defineStyles(styles: SystemStyleObject): SystemStyleObject {
  return styles;
}
