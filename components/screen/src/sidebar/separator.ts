/**
 * Draws the rule parting one block of destinations from the next.
 *
 * @remarks
 *   The layout package's divider drawn under a slot of this sidebar's own, so a theme moves the
 *   room on either side of the line with the sidebar's size rather than with the divider's. It
 *   keeps the `separator` role the `hr` element carries, because a rule between two blocks of
 *   destinations is a grouping a reader gets no other way. State `aria-hidden` on one drawn purely
 *   for rhythm.
 */

import { type ComponentProps } from "react";

import { Divider } from "@stealthscale/component-layout";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the rule at the room the column states.
 */
export const Separator = withContext(Divider, "separator");

/**
 * Describes what the rule takes.
 */
export type SeparatorProps = ComponentProps<typeof Separator>;
