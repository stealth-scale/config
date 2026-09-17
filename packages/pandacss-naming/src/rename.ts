/**
 * Rewrites a class the compiler wrote, in a stylesheet or at run time, into the scheme.
 *
 * @remarks
 *   A class is read against every recipe first, because the compiler's variant form and an atomic
 *   class share their characters and only the recipes tell them apart. A class no recipe claims is
 *   an atomic class. A class under a recipe that is not one of its variants is its base class or a
 *   compound, both of which the author named, so those pass through the atomic rewrite unchanged.
 *   Where one axis name prefixes another, the longest axis that fits is read, so `on-off` wins
 *   over `on` for `card--on-off-true` whatever their order.
 */

import { atomicClass } from "#atomic.ts";
import { type CompilerConfig, type Recipe, variantClass } from "#recipe.ts";

/**
 * Separates a recipe's class from an axis in the compiler's variant form.
 */
const VARIANT = "--";

/**
 * Lists the classes a recipe writes rules under: its own, and one per slot.
 */
function owners(recipe: Recipe): string[] {
  return [recipe.className, ...(recipe.slots ?? []).map((slot) => `${recipe.className}__${slot}`)];
}

/**
 * Rewrites a class the compiler wrote into the scheme, reading it as a variant where a recipe
 * claims it and as an atomic class otherwise.
 *
 * @returns The class in the scheme, or an empty string for a boolean axis at `false`, which no
 *   element carries.
 */
export function rename(pandaClass: string, config: CompilerConfig): string {
  for (const recipe of config.recipes) {
    const owner = owners(recipe).find((each) => pandaClass.startsWith(`${each}${VARIANT}`));

    if (owner === undefined) continue;

    const rest = pandaClass.slice(owner.length + VARIANT.length);
    const axis = recipe.axes
      .toSorted((one, other) => other.length - one.length)
      .find((each) => rest.startsWith(`${each}${config.separator}`));

    if (axis === undefined) continue;

    const written = variantClass(owner, axis, rest.slice(axis.length + config.separator.length));

    return written === "" ? "" : atomicClass(written);
  }

  return atomicClass(pandaClass);
}
