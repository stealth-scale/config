/**
 * Defines the semantic sizes a recipe reads: the height of a control, the box of an icon and the
 * height of a tag beside them.
 *
 * @remarks
 *   A recipe writes `height: "control.md"` and a theme moves every control by restating the
 *   scale, which is what lets a theme decide the density of a page.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { controls, icons, tags } from "#scales/geometry.ts";

/**
 * Describes the sizes a theme states.
 */
type Sizes = NonNullable<SemanticTokens["sizes"]>;

/**
 * Lists the three scales, each `xs` to `4xl`.
 */
export const sizes: Sizes = {
  control: controls(),
  icon: icons(),
  tag: tags(),
};
