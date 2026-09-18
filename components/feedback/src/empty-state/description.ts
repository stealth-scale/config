/**
 * Draws the line saying what would be here, or what to do about it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Draws the explanation, quieter than the title and at one size whatever the panel's is.
 */
export const Description = withContext("p", "description");

/**
 * Describes what the description takes.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
