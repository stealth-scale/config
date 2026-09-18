/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Quartz draws are placed by the role tables, and every other hue is the foundation's.
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

import { INKS, LINES, ROLES, SURFACES } from "#quartz/roles.ts";

/**
 * Points each semantic palette at the hue Quartz draws it in.
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
 * Casts the shadows: six heights of a soft double shadow in each mode.
 */
const SHADOWS = {
  "2xl": {
    value: {
      _dark: "0 0 8px rgba(0,0,0,0.24), 0 32px 64px rgba(0,0,0,0.28)",
      base: "0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.14)",
    },
  },
  lg: {
    value: {
      _dark: "0 0 2px rgba(0,0,0,0.24), 0 8px 16px rgba(0,0,0,0.28)",
      base: "0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)",
    },
  },
  md: {
    value: {
      _dark: "0 0 2px rgba(0,0,0,0.24), 0 4px 8px rgba(0,0,0,0.28)",
      base: "0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)",
    },
  },
  sm: {
    value: {
      _dark: "0 0 2px rgba(0,0,0,0.24), 0 2px 4px rgba(0,0,0,0.28)",
      base: "0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)",
    },
  },
  xl: {
    value: {
      _dark: "0 0 8px rgba(0,0,0,0.24), 0 14px 28px rgba(0,0,0,0.28)",
      base: "0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.14)",
    },
  },
  xs: {
    value: {
      _dark: "0 0 2px rgba(0,0,0,0.24), 0 1px 2px rgba(0,0,0,0.28)",
      base: "0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)",
    },
  },
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
  shadows: SHADOWS,
};
