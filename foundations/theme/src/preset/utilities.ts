/**
 * Adds a scale to the properties the compiler leaves off every scale.
 *
 * @remarks
 *   A utility the compiler ships already names the token category it reads, so `borderWidth`
 *   takes a step of `borderWidths`. A handful of properties are declared with no category, and
 *   those end up written as one raw length in one recipe and a slightly different one in the
 *   next. Naming the steps here puts the values in one place.
 */

import { type ExtendableUtilityConfig } from "#pandacss.ts";

/**
 * Fixes how far an underline sits below the words it runs under.
 *
 * @remarks
 *   Measured in em rather than pixels, because the underline belongs to the type: four pixels
 *   under a caption sits where a descender does, and the same four pixels under a heading close
 *   up against it.
 */
const UNDERLINE = {
  loose: "0.3em",
  normal: "0.2em",
  tight: "0.1em",
};

/**
 * Lists the utilities this preset adds to the compiler's.
 */
export const utilities: ExtendableUtilityConfig = {
  extend: {
    textUnderlineOffset: {
      className: "tu-o",
      group: "Typography",
      values: UNDERLINE,
    },
  },
};
