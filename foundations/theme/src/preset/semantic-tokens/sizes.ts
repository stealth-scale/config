/**
 * Defines the semantic sizes a recipe reads: the height of a control and the box of an icon.
 *
 * @remarks
 *   A recipe writes `height: "control.md"` and a theme moves every control by restating the
 *   scale, which is what lets a theme decide the density of a page.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { controls, icons } from "#scales/geometry.ts";

/**
 * Describes the sizes a theme states.
 */
type Sizes = NonNullable<SemanticTokens["sizes"]>;

/**
 * Lists the two scales, each `xs` to `xl`.
 */
export const sizes: Sizes = {
  control: controls(),
  icon: icons(),
};
