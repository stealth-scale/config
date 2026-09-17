/**
 * Reads what a recipe declares, without rendering anything.
 *
 * @remarks
 *   A recipe is a plain object, so the questions a specification asks of one are answered by
 *   reading it: which variants it offers, what it defaults to, which slots it styles. The readers
 *   are typed structurally and loosely rather than through the authoring types, because those
 *   keep every literal a recipe was written with, and a reader typed against them takes one
 *   recipe and refuses the next.
 */

/**
 * Describes the parts of a recipe a specification asks about.
 */
export interface Declared {
  /**
   * The styles every element the recipe draws starts from.
   */
  base?: unknown;

  /**
   * The prefix of every class the recipe emits.
   */
  className: string;

  /**
   * The combinations that draw something no single variant does.
   */
  compoundVariants?: readonly unknown[] | undefined;

  /**
   * The variant values a caller gets without asking.
   */
  defaultVariants?: unknown;

  /**
   * The tags the compiler extracts the variants from, as names or patterns.
   */
  jsx?: ReadonlyArray<RegExp | string> | undefined;

  /**
   * The parts the recipe styles, absent for a recipe that draws one element.
   */
  slots?: readonly string[] | undefined;

  /**
   * Each variant axis against the values it takes.
   */
  variants?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Describes a recipe that styles several parts rather than one element.
 */
export interface Slotted extends Declared {
  /**
   * The parts the recipe styles.
   */
  slots: readonly string[];
}

/**
 * Reads the values one variant offers, keyed by value.
 *
 * @throws {@link Error} When the recipe offers no variant under that name.
 */
function offered(recipe: Declared, axis: string): Readonly<Record<string, unknown>> {
  const values: unknown = recipe.variants?.[axis];

  if (typeof values !== "object" || values === null) {
    throw new Error(`The recipe ${recipe.className} offers no variant called ${axis}.`);
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an object is read by its keys, whatever they hold
  return values as Readonly<Record<string, unknown>>;
}

/**
 * Lists the values one variant offers, sorted.
 *
 * @throws {@link Error} When the recipe offers no variant under that name.
 */
export function valuesOf(recipe: Declared, axis: string): readonly string[] {
  return Object.keys(offered(recipe, axis)).toSorted();
}

/**
 * Lists every variant a recipe offers, sorted.
 */
export function axesOf(recipe: Declared): readonly string[] {
  return Object.keys(recipe.variants ?? {}).toSorted();
}

/**
 * Reads what a recipe draws when nothing is asked for, keyed by axis.
 */
export function defaultsOf(recipe: Declared): Readonly<Record<string, unknown>> {
  const defaults = recipe.defaultVariants;

  if (typeof defaults !== "object" || defaults === null) return {};

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an object is read by its keys, whatever they hold
  return defaults as Readonly<Record<string, unknown>>;
}

/**
 * Lists every slot a slot recipe styles, sorted.
 */
export function slotsOf(recipe: Slotted): readonly string[] {
  return [...recipe.slots].toSorted();
}

/**
 * Reads what one variant sets one property to, for each of its values in the order given.
 *
 * @remarks
 *   Reading the declared values back in a stated order lets a specification assert the shape of a
 *   scale rather than restate its numbers.
 * @throws {@link Error} When the recipe offers no variant under that name, or the order names a
 *   value the variant does not offer.
 */
export function scaleOf(
  recipe: Declared,
  axis: string,
  property: string,
  order: readonly string[],
): readonly unknown[] {
  const values = offered(recipe, axis);

  return order.map((value) => {
    const styles: unknown = values[value];

    if (typeof styles !== "object" || styles === null) {
      throw new Error(`The variant ${axis} of ${recipe.className} offers no value ${value}.`);
    }

    const read: unknown = Reflect.get(styles, property);

    return read;
  });
}

/**
 * Orders two steps of a scale numerically, so `2.5` comes before `10`.
 *
 * @returns A negative number where the first step is the smaller.
 */
export function byStep(one: unknown, other: unknown): number {
  return Number(one) - Number(other);
}
