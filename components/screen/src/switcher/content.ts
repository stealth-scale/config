/**
 * Draws the panel holding what the screen could switch to.
 *
 * @remarks
 *   The menu's own panel drawn under a slot of this recipe, so the placing, the escape and the
 *   focus trap come from that component and this decides the room the rows keep.
 */

import { type ComponentProps } from "react";

import { Menu } from "@stealthscale/component-disclosure";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the panel at the room the control states.
 */
export const Content = withContext(Menu.Content, "content");

/**
 * Describes what the panel takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
