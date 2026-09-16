/**
 * Defines the font sizes, drawn from the type scale at its defaults.
 *
 * @remarks
 *   A recipe reads a text style rather than a size, so the leading and tracking move with it.
 *   The sizes exist on their own for the one case that sets a size and nothing else, such as an
 *   icon drawn at the height of the text beside it.
 */

import { type Tokens } from "#pandacss.ts";
import { fontSizes as scale } from "#scales/type.ts";

/**
 * Describes the sizes a theme states.
 */
type FontSizes = NonNullable<Tokens["fontSizes"]>;

/**
 * Lists the sizes, `2xs` to `7xl`, on a body size of one rem and a ratio of 1.125.
 */
export const fontSizes: FontSizes = scale();
