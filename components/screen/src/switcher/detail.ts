/**
 * Draws the line under the name: a plan, an environment, a role.
 *
 * @remarks
 *   This is what tells two things of the same name apart, so it is read out rather than hidden.
 *   Leave it out where the name stands on its own.
 */

import { type ComponentProps } from "react";

import { withContext } from "#switcher/context.ts";

/**
 * Draws the line under the name.
 */
export const Detail = withContext("span", "detail");

/**
 * Describes what the detail takes.
 */
export type DetailProps = ComponentProps<typeof Detail>;
