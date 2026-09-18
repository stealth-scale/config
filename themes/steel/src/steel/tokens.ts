/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   IBM Plex Sans and IBM Plex Mono are taken from the packages that ship them, and a system stack
 *   follows each.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#steel/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 14 pixels.
 */
export const BODY = 0.875;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.145;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: {
      value:
        '"IBM Plex Sans Variable", system-ui, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", sans-serif',
    },
    heading: {
      value:
        '"IBM Plex Sans Variable", system-ui, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", sans-serif',
    },
    mono: {
      value:
        '"IBM Plex Mono", Menlo, "DejaVu Sans Mono", "Bitstream Vera Sans Mono", Courier, monospace',
    },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
