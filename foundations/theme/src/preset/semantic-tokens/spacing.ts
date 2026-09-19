/**
 * Defines the semantic spacing a recipe reads: the padding inside a control, the gap between
 * things, the gutter a list leaves for the browser's marker, and the room a device keeps at each
 * edge of the screen.
 *
 * @remarks
 *   A recipe writes `paddingInline: "inset.md"` and `gap: "gap.sm"` rather than a step of the
 *   grid, so a theme moves the spacing of every recipe by restating two scales. The marker gutter
 *   is in ems rather than rems, because a browser draws a marker outside the entry in the entry's
 *   own type size, and two and a half ems is the gutter every browser leaves by default.
 *   The safe area is the one spacing here a theme does not decide. A phone keeps room at an edge
 *   for a home indicator, a notch or a rounded corner, and the browser is the only thing that knows
 *   how much. Anything a page fixes to an edge reads these rather than writing `env()`, which a
 *   recipe may not do, and reads zero on every device that reserves nothing.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { gaps, insets } from "#scales/geometry.ts";

/**
 * Describes the spacing a theme states.
 */
type Spacing = NonNullable<SemanticTokens["spacing"]>;

/**
 * Lists the room a device keeps at each edge of the screen, zero where it keeps none.
 */
const safe = {
  bottom: { value: "env(safe-area-inset-bottom, 0px)" },
  left: { value: "env(safe-area-inset-left, 0px)" },
  right: { value: "env(safe-area-inset-right, 0px)" },
  top: { value: "env(safe-area-inset-top, 0px)" },
};

/**
 * Lists the two scales, each `xs` to `4xl`, the marker gutter and the safe area.
 */
export const spacing: Spacing = {
  gap: gaps(),
  inset: insets(),
  marker: { value: "2.5em" },
  safe,
};
