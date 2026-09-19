/**
 * Draws one thing the screen could switch to.
 *
 * @remarks
 *   The menu's option row drawn under a slot of this recipe, so it carries the checked state a
 *   screen reader reads and this decides the room a row with a mark and two lines keeps.
 *   State `checked` on the row standing for what the screen is showing. That is what a reader is
 *   told, and what the tick beside it draws.
 */

import { type ComponentProps } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the row at the room the control states.
 */
export const Option = withContext(Menu.OptionItem, "option");

/**
 * Describes what a row takes.
 */
export type OptionProps = ComponentProps<typeof Option>;
