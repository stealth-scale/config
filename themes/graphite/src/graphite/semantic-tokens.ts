/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Graphite draws are placed by the role tables, and every other hue is the foundation's.
 */

import {
  borders,
  foregrounds,
  type PaletteAliases,
  paletteRoles,
  palettes,
  surfaces,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

import { INKS, LINES, ROLES, SURFACES } from "#graphite/roles.ts";

/**
 * Points each semantic palette at the hue Graphite draws it in.
 */
const ALIASES: PaletteAliases = {
  accent: "green",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "blue",
  secondary: "purple",
  success: "green",
  warning: "yellow",
};

/**
 * Fixes the three corners: 3, 6 and 12 pixels.
 */
const CORNERS = {
  l1: { value: "0.1875rem" },
  l2: { value: "0.375rem" },
  l3: { value: "0.75rem" },
};

/**
 * Casts the shadows: two resting shadows and three floating ones in each mode, with an inset line.
 */
const SHADOWS = {
  "2xl": {
    value: {
      _dark: "0 0 0 1px #3d444d, 0 24px 48px 0 #010409",
      base: "0 0 0 1px #d1d9e000, 0 40px 80px 0 #25292e3d",
    },
  },
  inset: { value: { _dark: "inset 0 1px 0 0 #0104093d", base: "inset 0 1px 0 0 #1f23280a" } },
  lg: {
    value: {
      _dark: "0 0 0 1px #3d444d, 0 6px 12px -3px #01040966, 0 6px 18px 0 #01040966",
      base: "0 0 0 1px #d1d9e040, 0 6px 12px -3px #25292e0a, 0 6px 18px 0 #25292e1f",
    },
  },
  md: {
    value: {
      _dark: "0 1px 1px 0 #01040966, 0 3px 6px 0 #010409cc",
      base: "0 1px 1px 0 #25292e1a, 0 3px 6px 0 #25292e1f",
    },
  },
  sm: {
    value: {
      _dark: "0 1px 1px 0 #01040999, 0 1px 3px 0 #01040999",
      base: "0 1px 1px 0 #1f23280a, 0 1px 2px 0 #1f232808",
    },
  },
  xl: {
    value: {
      _dark:
        "0 0 0 1px #3d444d, 0 8px 16px -4px #01040966, 0 4px 32px -4px #01040966, 0 24px 48px -12px #01040966, 0 48px 96px -24px #01040966",
      base: "0 0 0 1px #d1d9e000, 0 8px 16px -4px #25292e14, 0 4px 32px -4px #25292e14, 0 24px 48px -12px #25292e14, 0 48px 96px -24px #25292e14",
    },
  },
  xs: { value: { _dark: "0 1px 1px 0 #010409cc", base: "0 1px 1px 0 #1f23280d" } },
};

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...palettes(ALIASES),
    bg: surfaces("gray", SURFACES, "gray.dark"),
    blue: paletteRoles("blue", ROLES.blue, "blue.dark"),
    border: borders("gray", LINES, "gray.dark"),
    cyan: paletteRoles("cyan", ROLES.cyan),
    fg: foregrounds("gray", INKS, "gray.dark"),
    gray: paletteRoles("gray", ROLES.gray, "gray.dark"),
    green: paletteRoles("green", ROLES.green, "green.dark"),
    indigo: paletteRoles("indigo", ROLES.indigo),
    orange: paletteRoles("orange", ROLES.orange, "orange.dark"),
    pink: paletteRoles("pink", ROLES.pink, "pink.dark"),
    purple: paletteRoles("purple", ROLES.purple, "purple.dark"),
    red: paletteRoles("red", ROLES.red, "red.dark"),
    teal: paletteRoles("teal", ROLES.teal),
    yellow: paletteRoles("yellow", ROLES.yellow, "yellow.dark"),
  },
  radii: CORNERS,
  shadows: SHADOWS,
};
