/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Lantern draws are placed by the role tables, and every other hue is the foundation's.
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

import { INKS, LINES, ROLES, SURFACES } from "#lantern/roles.ts";

/**
 * Points each semantic palette at the hue Lantern draws it in.
 */
const ALIASES: PaletteAliases = {
  accent: "cyan",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "blue",
  secondary: "indigo",
  success: "green",
  warning: "yellow",
};

/**
 * Fixes the three corners: 4, 6 and 8 pixels.
 */
const CORNERS = {
  l1: { value: "0.25rem" },
  l2: { value: "0.375rem" },
  l3: { value: "0.5rem" },
};

/**
 * Casts the shadows: three heights of a triple soft shadow in each mode.
 */
const SHADOWS = {
  lg: {
    value: {
      _dark:
        "0 6px 16px 0 rgba(255,255,255,0.016), 0 3px 6px -4px rgba(255,255,255,0.024), 0 9px 28px 8px rgba(255,255,255,0.010000000000000002)",
      base: "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
    },
  },
  md: {
    value: {
      _dark:
        "0 6px 16px 0 rgba(255,255,255,0.016), 0 3px 6px -4px rgba(255,255,255,0.024), 0 9px 28px 8px rgba(255,255,255,0.010000000000000002)",
      base: "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
    },
  },
  sm: {
    value: {
      _dark:
        "0 1px 2px 0 rgba(255,255,255,0.010000000000000002), 0 1px 6px -1px rgba(255,255,255,0.006), 0 2px 4px 0 rgba(255,255,255,0.006)",
      base: "0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 6px -1px rgba(0,0,0,0.03), 0 2px 4px 0 rgba(0,0,0,0.03)",
    },
  },
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
    cyan: paletteRoles("cyan", ROLES.cyan, "cyan.dark"),
    fg: foregrounds("gray", INKS, "gray.dark"),
    gray: paletteRoles("gray", ROLES.gray, "gray.dark"),
    green: paletteRoles("green", ROLES.green, "green.dark"),
    indigo: paletteRoles("indigo", ROLES.indigo, "indigo.dark"),
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
