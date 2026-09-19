/**
 * Draws the mark that opens an alert.
 *
 * @remarks
 *   The element is `div` and holds an `Icon` sized to the alert. It takes no colour of its own and
 *   reads the root's, so a solid alert marks itself in the ink the contrast gate measured against
 *   that fill.
 *   The mark states `aria-hidden`. It repeats what the title says in words, and a reader hearing
 *   the alert read out does not need a glyph named before it. A mark that is the only thing saying
 *   which status an alert carries fails WCAG 1.4.1, so the words carry it.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Marks the alert, at the size the root states.
 */
export const Indicator = withContext("div", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes what the mark takes: everything a styled div takes.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
