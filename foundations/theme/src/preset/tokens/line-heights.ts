/**
 * Defines the six leadings a text style names.
 *
 * @remarks
 *   The compiler's own set, restated here as data so the vocabulary defines each leading once.
 *   Unitless throughout, so a line height scales with whatever size the text ends up at.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the leadings a theme states.
 */
type LineHeights = NonNullable<Tokens["lineHeights"]>;

/**
 * Lists the leadings, from none to loose.
 */
export const lineHeights: LineHeights = {
  loose: { value: "2" },
  none: { value: "1" },
  normal: { value: "1.5" },
  relaxed: { value: "1.625" },
  snug: { value: "1.375" },
  tight: { value: "1.25" },
};
