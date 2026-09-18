/**
 * States Steel gray: Steel on grey pages, with white and charcoal layers lifting off them.
 *
 * @remarks
 *   The gray variant moves the page one step in from each end of the neutral ramp, so a layer is
 *   lighter than the page in light mode and darker in dark mode.
 */

import {
  borders,
  defineTheme,
  foregrounds,
  paletteRoles,
  surfaces,
  type Theme,
} from "@stealthscale/theme/authoring";

import { INKS, LINES, ROLES, SURFACES } from "#gray/roles.ts";
import { steel } from "#steel/index.ts";

/**
 * Draws Steel on grey pages, with white and charcoal layers lifting off them.
 */
export const steelGray: Theme = defineTheme({
  extends: steel,
  name: "steel-gray",
  semanticTokens: {
    colors: {
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
  },
});
