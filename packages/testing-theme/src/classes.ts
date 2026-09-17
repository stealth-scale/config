/**
 * Writes the classes a recipe emits, so a specification asserts on a name it derived rather than
 * one it copied.
 *
 * @remarks
 *   The names follow the naming scheme the build plugin renames the compiler's output into. A
 *   recipe emits its class name for the base rules, the class and two hyphens followed by the
 *   value for a string variant, followed by the axis for a boolean axis at `true`, and nothing at
 *   `false`. A slot recipe emits `<class>__<slot>` for each slot with the variant classes beside
 *   it. A unit test has no compiled stylesheet, so what a component owes its recipe is that the
 *   right class reaches the right element.
 */

import { compoundClass, slotClass, variantClass } from "@stealthscale/pandacss-naming";

export { compoundClass, slotClass, variantClass };

/**
 * Writes the class a recipe emits its base rules under, which is its class name unchanged.
 */
export function recipeClass(className: string): string {
  return className;
}

/**
 * Writes the class a slot recipe emits for one value of one variant on one slot.
 */
export function slotVariantClass(
  className: string,
  slot: string,
  axis: string,
  value: boolean | number | string,
): string {
  return variantClass(slotClass(className, slot), axis, value);
}
