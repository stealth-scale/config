/**
 * Defines the semantic spacing a recipe reads: the padding inside a control and the gap between
 * things.
 *
 * @remarks
 *   A recipe writes `paddingInline: "inset.md"` and `gap: "gap.sm"` rather than a step of the
 *   grid, so a theme moves the spacing of every recipe by restating two scales.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { gaps, insets } from "#scales/geometry.ts";

/**
 * Describes the spacing a theme states.
 */
type Spacing = NonNullable<SemanticTokens["spacing"]>;

/**
 * Lists the two scales, each `xs` to `xl`.
 */
export const spacing: Spacing = {
  gap: gaps(),
  inset: insets(),
};
