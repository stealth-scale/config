/**
 * Draws what an alert says after its title.
 *
 * @remarks
 *   The element is `span`, so the title and the description read as one run where the layout puts
 *   them on one line. A description that runs to paragraphs takes `as="div"` and holds them.
 *   The description reads the root's ink rather than the muted one, because an alert's fill is
 *   already the palette's and the contrast gate measured the pair on it. Muting the ink on a solid
 *   alert would drop it below the ratio the gate cleared.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Says the rest of what the alert is about.
 */
export const Description = withContext("span", "description");

/**
 * Describes what the description takes: everything a styled span takes.
 */
export type DescriptionProps = ComponentProps<typeof Description>;
