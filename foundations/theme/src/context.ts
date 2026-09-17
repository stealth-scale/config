/**
 * Binds a recipe to the elements that draw it.
 *
 * @remarks
 *   The generated context factories accept a recipe definition, but they compile one atomically:
 *   the classes land in the utilities layer under value-derived names, and a theme's extension
 *   targets the recipe layer under the recipe's own names, so a component bound through a raw
 *   definition could not be extended by a theme. The definition is turned into the compiler's
 *   runtime recipe here first, which is what a config recipe binds through, and the factories are
 *   handed that. A compound's class is the one its recipe named, which the compiler emitted the
 *   compound's styles under. Every factory returns a component typed by a name this package
 *   publishes, so a package that exports a bound component emits a declaration that names this
 *   package and nothing under it.
 */

import { type ElementType, type JSX, type Provider } from "react";

import { type Recipe, type SlotCompound, type SlotRecipe } from "#authoring/recipe.ts";
import { toVariantMap } from "#generated/helpers.mjs";
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
  ComponentProps,
  DataAttrs,
  JsxFactoryOptions,
  StyledComponent,
  UnstyledProps,
} from "#generated/types/jsx.d.mts";
import type {
  RecipeConfigVariantMap,
  RecipeSelection,
  RecipeVariantRecord,
  SlotRecipeVariantRecord,
  SlotRecord,
} from "#generated/types/recipe.d.mts";

/**
 * Describes what a root provider is given beside the element's own props.
 *
 * @typeParam Props - The props of the element the provider is bound to.
 */
export interface RootProviderOptions<Props> {
  /**
   * The props every instance starts from.
   */
  defaultProps?: (DataAttrs & Partial<Props>) | undefined;
}

/**
 * Draws the root of a compound component: an element that takes the recipe's variants and hands
 * them to every part below it.
 *
 * @typeParam Tag - The element or component the root is bound to.
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export type RootProvider<Tag extends ElementType, Variants extends RecipeVariantRecord> = (
  props: ComponentProps<Tag> & DataAttrs & RecipeSelection<Variants> & UnstyledProps,
) => JSX.Element;

/**
 * Describes what binding a recipe that draws one element returns.
 *
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export interface RecipeBinding<Variants extends RecipeVariantRecord> {
  /**
   * Sets variants for every bound element below it.
   */
  PropsProvider: Provider<DataAttrs & Partial<RecipeSelection<Variants>>>;

  /**
   * Reads the variants a provider above set, or undefined outside one.
   */
  usePropsContext: () => RecipeSelection<Variants> | undefined;

  /**
   * Binds an element, which then takes the recipe's variants beside its own props.
   */
  withContext: <Tag extends ElementType>(
    Component: Tag,
    options?: JsxFactoryOptions<ComponentProps<Tag>>,
  ) => StyledComponent<Tag, RecipeSelection<Variants>>;
}

/**
 * Describes what binding a recipe that draws several parts returns.
 *
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
export interface SlotRecipeBinding<
  Slots extends string,
  Variants extends SlotRecipeVariantRecord<Slots>,
> {
  /**
   * Binds a part below the provider, which draws the slot in the variants the provider set.
   */
  withContext: <Tag extends ElementType>(
    Component: Tag,
    slot: Slots,
    options?: JsxFactoryOptions<ComponentProps<Tag>>,
  ) => StyledComponent<Tag>;

  /**
   * Binds the part that takes the variants and draws a slot itself.
   */
  withProvider: <Tag extends ElementType>(
    Component: Tag,
    slot: Slots,
    options?: JsxFactoryOptions<ComponentProps<Tag>>,
  ) => StyledComponent<Tag, RecipeSelection<Variants>>;

  /**
   * Binds the part that takes the variants and draws no slot, for a root that renders nothing of
   * its own.
   */
  withRootProvider: <Tag extends ElementType>(
    Component: Tag,
    options?: RootProviderOptions<ComponentProps<Tag>>,
  ) => RootProvider<Tag, Variants>;
}

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
 * Carries the class a compound's styles are emitted under, per slot the compound styles.
 *
 * @typeParam Slots - Every part the recipe styles.
 */
interface Slotted<Slots extends string> {
  /**
   * The class of the compound, keyed by each slot it styles.
   */
  classNames?: SlotRecord<Slots, string> | undefined;
}

/**
 * Scopes a compound's class to the slots it styles, which is what the runtime's per-slot recipe
 * reads.
 *
 * @remarks
 *   The compiler takes one class per compound and the runtime takes one per slot. A compound
 *   `defineSlotRecipe` split styles one slot, so its class reaches that slot and no other. The
 *   single name is unset, because the runtime falls back to it for a slot the map leaves out.
 * @typeParam Slots - Every part the recipe styles.
 * @typeParam Variants - Each axis it offers, against the values it takes.
 */
function slotted<Slots extends string, Variants extends SlotRecipeVariantRecord<Slots>>(
  slots: readonly Slots[],
  compound: SlotCompound<Slots, Variants>,
): SlotCompound<Slots, Variants> & Slotted<Slots> {
  const { className } = compound;

  if (className === undefined) return compound;

  const classNames: SlotRecord<Slots, string> = {};

  for (const slot of slots) {
    if (compound.css[slot] !== undefined) classNames[slot] = className;
  }

  return { ...compound, className: undefined, classNames };
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
    ...(recipe.compoundVariants === undefined
      ? {}
      : {
          compoundVariants: recipe.compoundVariants.map((compound) =>
            slotted(recipe.slots, compound),
          ),
        }),
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
 * @remarks
 *   Every bound element carries the recipe's name as `data-recipe`, which is the handle a
 *   specification finds it by.
 * @typeParam Variants - Each axis the recipe offers, against the values it takes.
 */
export function createRecipeContext<const Variants extends RecipeVariantRecord>(
  recipe: Recipe<Variants>,
): RecipeBinding<Variants> {
  const generated: unknown = bindRecipe(createRecipe(toRuntimeConfig(recipe)));
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the generated context is typed by names private to the runtime, and the element it draws takes the props the published type describes, with the style props and the variants assigned in the other order
  const bound = generated as RecipeBinding<Variants>;

  return {
    ...bound,
    withContext: (Component, options) =>
      bound.withContext(Component, { dataAttr: true, ...options }),
  };
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
>(recipe: SlotRecipe<Slots, Variants>): SlotRecipeBinding<Slots, Variants> {
  const generated: unknown = bindSlots(createSlotRecipe(toSlotRuntimeConfig(recipe)));

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- as above, and the slot a part is bound to is one of the recipe's, which the generated type resolves through a conditional the checker cannot settle for a generic recipe
  return generated as SlotRecipeBinding<Slots, Variants>;
}
