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
 * Lists the three scales, each `xs` to `4xl`, and the reading measure.
 *
 * @remarks
 *   The measure is in characters rather than in rems, because the line a reader follows without
 *   losing their place is counted in characters and not in length. Sixty-five is the middle of the
 *   range typography has measured for body text, and stating it in `ch` keeps it right at every
 *   type size a theme sets.
 */
export const sizes: Sizes = {
  control: controls(),
  icon: icons(),
  prose: { value: "65ch" },
  tag: tags(),
};
