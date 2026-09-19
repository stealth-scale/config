/**
 * Draws the mark that turns as a branch opens.
 *
 * @remarks
 *   The mark says nothing a screen reader needs, because the trigger it sits in already says
 *   whether the list is expanded. It is hidden from the accessibility tree for that reason, and a
 *   caller hands over a glyph without sizing it or turning it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/state.ts";

/**
 * Draws the mark at the end of the row.
 */
const Turned = withContext("span", "indicator", { defaultProps: { "aria-hidden": true } });

/**
 * Describes what an indicator takes.
 */
export type IndicatorProps = ComponentProps<typeof Turned>;

/**
 * Turns while the list beneath the row is open.
 *
 * @param props - Everything a styled span takes.
 * @returns The mark, turned to whichever way the branch is.
 */
export function Indicator(props: IndicatorProps): ReactElement {
  const branch = useBranch();

  return <Turned data-state={branch.open ? "open" : "closed"} {...props} />;
}
