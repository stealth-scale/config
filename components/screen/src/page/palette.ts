/**
 * Draws the panel the picker opens.
 *
 * @remarks
 *   It takes the picker's own width, so the list lines up under the control that opened it rather
 *   than floating at a width of its own. Put a popover's content here with `as`, and the command
 *   palette or a list of links inside that.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the panel at the width the control that opened it has.
 */
export const Palette = withContext("div", "palette");

/**
 * Describes what the panel takes.
 */
export type PaletteProps = ComponentProps<typeof Palette>;
