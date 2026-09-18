/**
 * States Graphite high contrast: Graphite at high contrast in both modes.
 *
 * @remarks
 *   The high-contrast variant redraws every ramp in both modes and places every surface and role
 *   again.
 */

import {
  borders,
  defineTheme,
  foregrounds,
  paletteRoles,
  surfaces,
  type Theme,
} from "@stealthscale/theme/authoring";

import { ramps } from "#contrast/ramps.ts";
import { INKS, LINES, ROLES, SURFACES } from "#contrast/roles.ts";
import { graphite } from "#graphite/index.ts";

/**
 * Draws Graphite at high contrast in both modes.
 */
export const graphiteContrast: Theme = defineTheme({
  extends: graphite,
  name: "graphite-contrast",
  semanticTokens: {
    colors: {
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
  },
  tokens: { colors: ramps },
});
