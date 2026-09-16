/**
 * Defines the blur radii a filter reads.
 *
 * @remarks
 *   The compiler's scale starts at four pixels, which is a frosted panel. Two steps sit below it:
 *   `2xs` at one pixel holds text back from a reader without hiding it, and `none` is the same
 *   knob turned off, so a rule that lifts the blur on hover names a step rather than a nought.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the blurs a theme states.
 */
type Blurs = NonNullable<Tokens["blurs"]>;

/**
 * Lists the blurs, from none to a whole panel.
 */
export const blurs: Blurs = {
  "2xl": { value: "40px" },
  "2xs": { value: "1px" },
  "3xl": { value: "64px" },
  lg: { value: "16px" },
  md: { value: "12px" },
  none: { value: "0" },
  sm: { value: "8px" },
  xl: { value: "24px" },
  xs: { value: "4px" },
};
