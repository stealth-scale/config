/**
 * Draws the band above the header, for something true of the whole page.
 *
 * @remarks
 *   A trial ending, an environment that takes no writes, an incident in progress. The band keeps
 *   the page's gutter and measure, so a notice lines up with the title under it rather than running
 *   to the window's edges.
 *   It says nothing by itself. Put the feedback package's alert inside it, which carries the role
 *   and the live region a notice needs.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the band at the room the column states.
 */
export const Banner = withContext("div", "banner");

/**
 * Describes what the banner takes.
 */
export type BannerProps = ComponentProps<typeof Banner>;
