/**
 * States Compass high contrast: Compass at increased contrast in both modes.
 *
 * @remarks
 *   The high-contrast variant places every surface, ink, line and role again on the same ramps,
 *   further from the page.
 */

import {
  borders,
  defineTheme,
  foregrounds,
  paletteRoles,
  surfaces,
  type Theme,
} from "@stealthscale/theme/authoring";

import { compass } from "#compass/index.ts";
import { INKS, LINES, ROLES, SURFACES } from "#contrast/roles.ts";

/**
 * Draws Compass at increased contrast in both modes.
 */
export const compassContrast: Theme = defineTheme({
  extends: compass,
  name: "compass-contrast",
  semanticTokens: {
    colors: {
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
  },
});
