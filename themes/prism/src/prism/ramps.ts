/**
 * Nests each hue's dark ramp under its light one, so a role reads `{colors.blue.5}` in light mode
 * and `{colors.blue.dark.5}` in dark mode.
 */

import { type Tokens } from "@stealthscale/theme/authoring";

import { darkRamps } from "#prism/dark-ramps.ts";
import { lightRamps, type Ramped } from "#prism/light-ramps.ts";

/**
 * Describes the colors a theme states.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Lists every ramp Prism draws, the dark one nested under the light one.
 */
export const ramps: Readonly<Record<Ramped, Colors>> = {
  blue: { ...lightRamps.blue, dark: darkRamps.blue },
  cyan: { ...lightRamps.cyan, dark: darkRamps.cyan },
  gray: { ...lightRamps.gray, dark: darkRamps.gray },
  green: { ...lightRamps.green, dark: darkRamps.green },
  indigo: { ...lightRamps.indigo, dark: darkRamps.indigo },
  orange: { ...lightRamps.orange, dark: darkRamps.orange },
  pink: { ...lightRamps.pink, dark: darkRamps.pink },
  purple: { ...lightRamps.purple, dark: darkRamps.purple },
  red: { ...lightRamps.red, dark: darkRamps.red },
  teal: { ...lightRamps.teal, dark: darkRamps.teal },
  yellow: { ...lightRamps.yellow, dark: darkRamps.yellow },
};
