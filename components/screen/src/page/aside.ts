/**
 * Draws the column beside the body: an activity trail, a panel of metadata, what relates to the
 * thing shown without being it.
 *
 * @remarks
 *   The element is `aside`, which is a complementary landmark. Name it, because a screen reader
 *   announces an unnamed one as `complementary` with nothing to say what it holds.
 *   It is a peer of the body rather than something inside it, so a page that lays the two side by
 *   side puts them in a grid and each keeps its own scroll.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Draws the column at the room the page states.
 */
export const Aside = withContext("aside", "aside");

/**
 * Describes what the aside takes.
 */
export type AsideProps = ComponentProps<typeof Aside>;
