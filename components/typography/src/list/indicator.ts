/**
 * Draws the mark a caller puts beside an entry in place of the browser's.
 *
 * @remarks
 *   The element is `span`, and what it holds is the caller's, an icon or a figure. It sits beside
 *   the entry's text at the small gap, in the plain look that leaves the entry a row. It is hidden
 *   from assistive technology, because a mark stands in for the browser's bullet, which a screen
 *   reader does not read either, and a glyph read aloud before every entry is noise.
 */

import { type ComponentProps } from "react";

import { withContext } from "#list/context.ts";

/**
 * Draws the mark beside an entry, holding whatever the caller hands it, hidden from assistive
 * technology.
 */
export const Indicator = withContext("span", "indicator", {
  defaultProps: { "aria-hidden": true },
});

/**
 * Describes what an indicator takes: everything a styled span element takes.
 */
export type IndicatorProps = ComponentProps<typeof Indicator>;
