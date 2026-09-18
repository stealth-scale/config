/**
 * States the values that change with the color mode: the surfaces, the inks, the lines, every
 * palette, the corners and the shadows.
 *
 * @remarks
 *   The contract asks a root theme for every hue palette and every semantic palette. The hues
 *   Pebble draws are placed by the role tables, and every other hue is the foundation's.
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

import { INKS, LINES, ROLES, SURFACES } from "#pebble/roles.ts";

/**
 * Points each semantic palette at the hue Pebble draws it in.
 */
const ALIASES: PaletteAliases = {
  accent: "blue",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "gray",
  secondary: "blue",
  success: "green",
  warning: "orange",
};

/**
 * Fixes the three corners: 6, 8 and 10 pixels.
 */
const CORNERS = {
  l1: { value: "0.375rem" },
  l2: { value: "0.5rem" },
  l3: { value: "0.625rem" },
};

/**
 * Casts the shadows: six heights of a soft double shadow, the same in both modes, with an inner
 * shadow.
 */
const SHADOWS = {
  "2xl": {
    value: {
      _dark: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      base: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
  },
  inner: {
    value: {
      _dark: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      base: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    },
  },
  lg: {
    value: {
      _dark: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      base: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
  },
  md: {
    value: {
      _dark: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      base: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
  },
  sm: {
    value: {
      _dark: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    },
  },
  xl: {
    value: {
      _dark: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      base: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
  },
  xs: { value: { _dark: "0 1px 2px 0 rgb(0 0 0 / 0.05)", base: "0 1px 2px 0 rgb(0 0 0 / 0.05)" } },
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
