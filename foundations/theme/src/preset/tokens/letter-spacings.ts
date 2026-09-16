/**
 * Defines the six trackings a text style names.
 *
 * @remarks
 *   The compiler's own set, restated here as data so the vocabulary defines each tracking once.
 *   Stated in em so one value is right at every size: a display size tightens and a caption in
 *   capitals widens by the same share of its own letters.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the trackings a theme states.
 */
type LetterSpacings = NonNullable<Tokens["letterSpacings"]>;

/**
 * Lists the trackings, from tighter to widest.
 */
export const letterSpacings: LetterSpacings = {
  normal: { value: "0em" },
  tight: { value: "-0.025em" },
  tighter: { value: "-0.05em" },
  wide: { value: "0.025em" },
  wider: { value: "0.05em" },
  widest: { value: "0.1em" },
};
