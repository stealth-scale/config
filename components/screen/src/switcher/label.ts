/**
 * Draws the column holding the current thing's name over its detail.
 *
 * @remarks
 *   Two lines rather than one, because a workspace has a name and a plan, a project has a name and
 *   an environment, and the second line is what tells two things of the same name apart.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the column at the room the control states.
 */
export const Label = withContext("span", "label");

/**
 * Describes what the label column takes.
 */
export type LabelProps = ComponentProps<typeof Label>;
