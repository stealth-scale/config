/**
 * Draws the tick beside the thing the screen is showing.
 *
 * @remarks
 *   The menu's own item indicator drawn under a slot of this recipe, so it appears and goes with
 *   the row's checked state rather than with a prop this component tracks.
 *   It says nothing a screen reader needs. The row already reports whether it is the current one.
 */

import { type ComponentProps } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the tick at the end of the row.
 */
export const Check = withContext(Menu.ItemIndicator, "check");

/**
 * Describes what the tick takes.
 */
export type CheckProps = ComponentProps<typeof Check>;
