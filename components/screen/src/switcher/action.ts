/**
 * Draws a row of the panel that does something other than switch.
 *
 * @remarks
 *   `New workspace`, `Manage members`, `Leave`. These are not things to switch between, so they are
 *   plain rows rather than options and carry no tick: a reader is not told one of them is current,
 *   because none of them is.
 *   Put a separator between the things to switch to and these, so the two sets read apart.
 */

import { type ComponentProps } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the row at the room the control states.
 */
export const Action = withContext(Menu.Item, "action");

/**
 * Describes what a row takes.
 */
export type ActionProps = ComponentProps<typeof Action>;
