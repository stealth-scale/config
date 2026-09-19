/**
 * Draws the current thing's name.
 *
 * @remarks
 *   Cut short rather than wrapped, so a long name leaves the control one line tall and the sidebar
 *   holding it keeps its rhythm.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the name at the size the control states.
 */
export const Name = withContext("span", "name");

/**
 * Describes what the name takes.
 */
export type NameProps = ComponentProps<typeof Name>;
