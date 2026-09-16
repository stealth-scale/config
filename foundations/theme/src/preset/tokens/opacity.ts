/**
 * Defines the three opacities a recipe names.
 *
 * @remarks
 *   A recipe writes `opacity: "disabled"` rather than a number, so a theme that draws a disabled
 *   control fainter or firmer changes one token. `backdrop` is what a dialog's backdrop dims the
 *   page by, and `muted` is what a secondary element is held back by where a color would not do.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the opacities a theme states.
 */
type Opacities = NonNullable<Tokens["opacity"]>;

/**
 * Lists the opacities.
 */
export const opacity: Opacities = {
  backdrop: { value: "0.44" },
  disabled: { value: "0.5" },
  muted: { value: "0.64" },
};
