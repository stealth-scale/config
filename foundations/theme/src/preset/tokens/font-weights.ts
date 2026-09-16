/**
 * Defines the nine font weights.
 *
 * @remarks
 *   The compiler's own set, restated here as data so the vocabulary defines each weight once. A
 *   text style names one of these, and a theme with a face that ships fewer weights maps the
 *   names it lacks onto the ones it has.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the weights a theme states.
 */
type FontWeights = NonNullable<Tokens["fontWeights"]>;

/**
 * Lists the weights, from thin to black.
 */
export const fontWeights: FontWeights = {
  black: { value: "900" },
  bold: { value: "700" },
  extrabold: { value: "800" },
  extralight: { value: "200" },
  light: { value: "300" },
  medium: { value: "500" },
  normal: { value: "400" },
  semibold: { value: "600" },
  thin: { value: "100" },
};
