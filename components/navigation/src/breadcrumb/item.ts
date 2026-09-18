/**
 * Draws one crumb of the trail.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Draws one row of the trail, carrying either a link to somewhere above or the name of the page
 * itself.
 */
export const Item = withContext("li", "item");

/**
 * Describes what a crumb takes.
 */
export type ItemProps = ComponentProps<typeof Item>;
