/**
 * States the values that do not change with the color mode: the ramps, the faces and the type
 * scale.
 *
 * @remarks
 *   Geist and Geist Mono are taken from the packages that ship them, and a system stack follows
 *   each.
 */

import { fontSizes, type Tokens } from "@stealthscale/theme/authoring";

import { ramps } from "#pebble/ramps.ts";

/**
 * Fixes the body size in rem: body text is set at 16 pixels.
 */
export const BODY = 1;

/**
 * Fixes the ratio the type scale climbs by.
 */
export const RATIO = 1.177;

/**
 * Lists the tokens: the ramps, the three faces and the type scale.
 */
export const tokens: Tokens = {
  colors: ramps,
  fonts: {
    body: {
      value:
        '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    heading: {
      value:
        '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    mono: {
      value:
        '"Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  fontSizes: fontSizes(BODY, RATIO),
};
