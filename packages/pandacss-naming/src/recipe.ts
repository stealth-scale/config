/**
 * Writes the classes of a recipe in the scheme: the slot, the variant and the compound.
 *
 * @remarks
 *   The compiler writes a variant as the class, two hyphens, the axis, the separator and the
 *   value. The scheme drops the axis for a string value, writes the axis alone for `true`, and
 *   writes nothing for `false`, so an element carries `button--lg` and `button--loading` and
 *   nothing marks the absence of a state. The values of one recipe are therefore unique across its
 *   axes, and a compound carries a name of its own that no axis and no value equals. The gate
 *   holds both, and this module trusts them.
 */

import { kebab, sanitise } from "#sanitise.ts";

/**
 * Describes a recipe as far as the scheme reads it: its class, its axes and its slots.
 */
export interface Recipe {
  /**
   * The axes the recipe's variants are declared under.
   */
  axes: readonly string[];
  /**
   * The class the recipe's base rules are written under.
   */
  className: string;
  /**
   * The slots of a slot recipe, each written as `<class>__<slot>`.
   */
  slots?: readonly string[] | undefined;
}

/**
 * Lists the separators the compiler accepts between an axis and its value.
 */
export type Separator = "_" | "-" | "=";

/**
 * Describes what the scheme reads of the compiler's configuration to recognise a class it wrote.
 */
export interface CompilerConfig {
  /**
   * Every recipe the stylesheet was compiled with, slot recipes included.
   */
  recipes: readonly Recipe[];
  /**
   * The separator the compiler was configured with.
   */
  separator: Separator;
}

/**
 * Writes the class a recipe's variant is applied under, or nothing for a boolean axis at `false`.
 *
 * @remarks
 *   A boolean value arrives as a boolean from a recipe function and as the strings `true` and
 *   `false` from a stylesheet, so both spellings are read.
 * @returns `<class>--<value>` for a string or a number, `<class>--<axis>` for `true`, and an empty
 *   string for `false`.
 */
export function variantClass(
  className: string,
  axis: string,
  value: boolean | number | string,
): string {
  const written = String(value);

  if (written === "true") return `${className}--${sanitise(kebab(axis))}`;
  if (written === "false") return "";

  return `${className}--${sanitise(kebab(written))}`;
}

/**
 * Writes the class a slot recipe applies to one slot.
 */
export function slotClass(className: string, slot: string): string {
  return `${className}__${kebab(slot)}`;
}

/**
 * Writes the class a compound is applied under, from the name its author gave it.
 */
export function compoundClass(className: string, name: string): string {
  return `${className}--${sanitise(kebab(name))}`;
}
