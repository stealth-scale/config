/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Prism draws are placed by the role tables, and every other hue is the foundation's.
 */

import {
  borders,
  foregrounds,
  type PaletteAliases,
  paletteRoles,
  palettes,
  shadows,
  surfaces,
  type ThemeTokens,
} from "@stealthscale/theme/authoring";

import { INKS, LINES, ROLES, SURFACES } from "#prism/roles.ts";

/**
 * Points each semantic palette at the hue Prism draws it in.
 */
const ALIASES: PaletteAliases = {
  accent: "indigo",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "blue",
  secondary: "purple",
  success: "green",
  warning: "orange",
};

/**
 * Fixes the three corners: 4, 8 and 10 pixels.
 */
const CORNERS = {
  l1: { value: "0.25rem" },
  l2: { value: "0.5rem" },
  l3: { value: "0.625rem" },
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
    teal: paletteRoles("teal", ROLES.teal, "teal.dark"),
    yellow: paletteRoles("yellow", ROLES.yellow, "yellow.dark"),
  },
  radii: CORNERS,
  shadows: shadows(0, 1),
};
