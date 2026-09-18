/**
 * States Graphite dimmed: Graphite with a dimmed dark mode: a softer dark page for long sessions.
 *
 * @remarks
 *   The dimmed variant redraws every dark ramp and places the dark surfaces and roles again. The
 *   light mode is Graphite's.
 */

import {
  borders,
  defineTheme,
  foregrounds,
  paletteRoles,
  surfaces,
  type Theme,
} from "@stealthscale/theme/authoring";

import { darkRamps } from "#dimmed/dark-ramps.ts";
import { INKS, LINES, ROLES, SURFACES } from "#dimmed/roles.ts";
import { graphite } from "#graphite/index.ts";

/**
 * Draws Graphite with a dimmed dark mode: a softer dark page for long sessions.
 */
export const graphiteDimmed: Theme = defineTheme({
  extends: graphite,
  name: "graphite-dimmed",
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
  tokens: { colors: darkRamps },
});
