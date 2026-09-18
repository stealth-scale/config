/**
 * Separates the recipe's variants from the props the element takes, so a submenu is drawn in the
 * variants of the menu it opens from.
 *
 * @remarks
 *   A slot recipe resolves its variants where a root provides them, and it resolves them from the
 *   values that root was given alone. A submenu is a root of its own, so without this it would fall
 *   back to the recipe's defaults and a small menu would open a medium submenu. The variants a
 *   caller picked are carried down the nest instead, and a submenu that picks its own overrides
 *   them for itself and everything below it.
 */

import { type RecipeProps } from "@stealthscale/theme/authoring";

import { recipe } from "#menu/recipe.ts";

/**
 * Describes the variants a caller picks on a menu.
 */
export type MenuVariants = RecipeProps<typeof recipe>;

/**
 * Lists the axes the recipe offers, read from the recipe so the two never drift.
 *
 * @remarks
 *   The compiler types a recipe's variants as optional and this recipe states four, so the read
 *   cannot find them absent and a fallback here would be a branch no case can take.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
const AXES = new Set<string>(Object.keys(recipe.variants as object));

/**
 * Splits the recipe's variants out of the props a root was handed.
 *
 * @param props - Everything the root was given once the machine's settings are out of it.
 * @returns The variants the caller picked, and everything the element takes.
 */
export function splitMenuVariants<Props extends object>(
  props: Props,
): readonly [MenuVariants, Props] {
  const picked: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(props)) {
    if (AXES.has(name)) picked[name] = value;
    else rest[name] = value;
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every key kept is one the caller wrote, split by whether the recipe names it as an axis
  return [picked, rest as Props];
}
