/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Steel draws are placed by the role tables, and every other hue is the foundation's.
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

import { INKS, LINES, ROLES, SURFACES } from "#steel/roles.ts";

/**
 * Points each semantic palette at the hue Steel draws it in.
 */
const ALIASES: PaletteAliases = {
  accent: "teal",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "blue",
  secondary: "purple",
  success: "green",
  warning: "yellow",
};

/**
 * Fixes the three corners: square corners.
 */
const CORNERS = {
  l1: { value: "0" },
  l2: { value: "0" },
  l3: { value: "0" },
};

/**
 * Lists every semantic token, by category.
 */
export const semanticTokens: ThemeTokens = {
  colors: {
    ...palettes(ALIASES),
    bg: surfaces("gray", SURFACES),
    blue: paletteRoles("blue", ROLES.blue),
    border: borders("gray", LINES),
    cyan: paletteRoles("cyan", ROLES.cyan),
    fg: foregrounds("gray", INKS),
    gray: paletteRoles("gray", ROLES.gray),
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
  shadows: shadows(0, 1),
};
