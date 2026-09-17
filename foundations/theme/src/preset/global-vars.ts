/**
 * Registers the custom properties an animation interpolates.
 *
 * @remarks
 *   A browser animates a registered property between two values and leaves an unregistered one to
 *   jump, so the angle a moving border sweeps through is registered here with its type. The
 *   compiler writes the registration once, at the top of the stylesheet.
 */

import { type Preset } from "#pandacss.ts";

/**
 * Describes the custom properties a preset registers.
 */
type GlobalVars = NonNullable<Preset["globalVars"]>;

/**
 * Lists the registered properties: the angle a conic gradient is drawn from.
 */
export const globalVars: GlobalVars = {
  extend: {
    "--angle": { inherits: false, initialValue: "0deg", syntax: "<angle>" },
  },
};
