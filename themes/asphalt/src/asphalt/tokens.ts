/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   Inter is taken from the package that ships it, and a system stack follows it. The code face is
 *   a system monospace stack.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#asphalt/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 16 pixels.
 */
export const BODY = 1;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.144;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: { value: '"Inter Variable", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif' },
    heading: {
      value: '"Inter Variable", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    mono: { value: '"Lucida Console", Monaco, monospace' },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
