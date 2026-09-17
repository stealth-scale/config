/**
 * Defines the semantic spacing a recipe reads: the padding inside a control, the gap between
 * things, and the gutter a list leaves for the browser's marker.
 *
 * @remarks
 *   A recipe writes `paddingInline: "inset.md"` and `gap: "gap.sm"` rather than a step of the
 *   grid, so a theme moves the spacing of every recipe by restating two scales. The marker gutter
 *   is in ems rather than rems, because a browser draws a marker outside the entry in the entry's
 *   own type size, and two and a half ems is the gutter every browser leaves by default.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { gaps, insets } from "#scales/geometry.ts";

/**
 * Describes the spacing a theme states.
 */
type Spacing = NonNullable<SemanticTokens["spacing"]>;

/**
 * Lists the two scales, each `xs` to `4xl`, and the marker gutter.
 */
export const spacing: Spacing = {
  gap: gaps(),
  inset: insets(),
  marker: { value: "2.5em" },
};
