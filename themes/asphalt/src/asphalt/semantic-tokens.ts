/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Asphalt draws are placed by the role tables, and every other hue is the foundation's.
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

import { INKS, LINES, ROLES, SURFACES } from "#asphalt/roles.ts";

/**
 * Points each semantic palette at the hue Asphalt draws it in.
 */
const ALIASES: PaletteAliases = {
  accent: "blue",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "gray",
  secondary: "blue",
  success: "green",
  warning: "yellow",
};

/**
 * Fixes the three corners: 4, 8 and 12 pixels.
 */
const CORNERS = {
  l1: { value: "0.25rem" },
  l2: { value: "0.5rem" },
  l3: { value: "0.75rem" },
};

/**
 * Casts the shadows: four heights of a single soft shadow, the same in both modes.
 */
const SHADOWS = {
  lg: {
    value: { _dark: "0 8px 24px hsla(0, 0%, 0%, 0.16)", base: "0 8px 24px hsla(0, 0%, 0%, 0.16)" },
  },
  md: {
    value: { _dark: "0 4px 16px hsla(0, 0%, 0%, 0.16)", base: "0 4px 16px hsla(0, 0%, 0%, 0.16)" },
  },
  sm: {
    value: { _dark: "0 2px 8px hsla(0, 0%, 0%, 0.16)", base: "0 2px 8px hsla(0, 0%, 0%, 0.16)" },
  },
  xs: {
    value: { _dark: "0 1px 4px hsla(0, 0%, 0%, 0.16)", base: "0 1px 4px hsla(0, 0%, 0%, 0.16)" },
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
    cyan: paletteRoles("cyan", ROLES.cyan),
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
  shadows: SHADOWS,
};
