/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   Source Sans 3 and Source Code Pro are taken from the packages that ship them, and a system
 *   stack follows each.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#prism/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 14 pixels.
 */
export const BODY = 0.875;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.124;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: { value: '"Source Sans 3 Variable", "Helvetica Neue", Helvetica, Arial, sans-serif' },
    heading: { value: '"Source Sans 3 Variable", "Helvetica Neue", Helvetica, Arial, sans-serif' },
    mono: { value: '"Source Code Pro Variable", Monaco, monospace' },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
