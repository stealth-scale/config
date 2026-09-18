/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Compass draws are placed by the role tables, and every other hue is the foundation's.
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

import { INKS, LINES, ROLES, SURFACES } from "#compass/roles.ts";

/**
 * Points each semantic palette at the hue Compass draws it in.
 */
const ALIASES: PaletteAliases = {
  accent: "teal",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "blue",
  secondary: "purple",
  success: "green",
  warning: "orange",
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
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...palettes(ALIASES),
    bg: surfaces("gray", SURFACES, "gray.dark"),
    blue: paletteRoles("blue", ROLES.blue),
    border: borders("gray", LINES, "gray.dark"),
    cyan: paletteRoles("cyan", ROLES.cyan),
    fg: foregrounds("gray", INKS, "gray.dark"),
    gray: paletteRoles("gray", ROLES.gray, "gray.dark"),
    green: paletteRoles("green", ROLES.green),
    indigo: paletteRoles("indigo", ROLES.indigo),
    orange: paletteRoles("orange", ROLES.orange),
    pink: paletteRoles("pink", ROLES.pink),
    purple: paletteRoles("purple", ROLES.purple),
    red: paletteRoles("red", ROLES.red),
    teal: paletteRoles("teal", ROLES.teal),
    yellow: paletteRoles("yellow", ROLES.yellow),
  },
  radii: CORNERS,
  shadows: shadows(260, 1),
};
