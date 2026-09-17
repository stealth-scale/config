/**
 * Writes the classes a recipe emits, so a specification asserts on a name it derived rather than
 * one it copied.
 *
 * @remarks
 *   The names follow the compiler's scheme. A recipe emits its class name for the base rules and
 *   the class, two hyphens, the axis, the separator and the value for each variant, and a slot
 *   recipe emits `<class>__<slot>` for each
 *   slot with the variant classes beside it. A unit test has no compiled stylesheet, so what a
 *   component owes its recipe is that the right class reaches the right element.
 */

import { SEPARATOR } from "@stealthscale/theme/authoring";

/**
 * Writes the class a recipe emits its base rules under, which is its class name unchanged.
 */
export function recipeClass(className: string): string {
  return className;
}

/**
 * Writes the class a recipe emits for one value of one variant.
 */
export function variantClass(
  className: string,
  axis: string,
  value: boolean | number | string,
): string {
  return `${className}--${axis}${SEPARATOR}${String(value)}`;
}

/**
 * Writes the class a slot recipe emits for one slot.
 */
export function slotClass(className: string, slot: string): string {
  return `${className}__${slot}`;
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
