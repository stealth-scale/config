/**
 * Draws a crumb that goes somewhere.
 *
 * @remarks
 *   The element is `a`, and it takes an `href` like any other. A crumb with nowhere to go is the
 *   page itself, which the current crumb draws rather than this.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Draws a link to somewhere above the page.
 */
export const Link = withContext("a", "link");

/**
 * Describes what a crumb's link takes.
 */
export type LinkProps = ComponentProps<typeof Link>;
