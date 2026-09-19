/**
 * Draws the panel on the end side, which is where an application keeps what goes with the page.
 *
 * @remarks
 *   The element is `aside`, which carries the `complementary` landmark. Name it with `aria-label`
 *   where an application draws more than one, so a reader jumping by landmark hears which is which.
 */

import { type ReactElement } from "react";

import { Panel, type PanelProps } from "#app-shell/panel.tsx";

/**
 * Describes what the end panel takes.
 */
export type AsideProps = Omit<PanelProps, "side">;

/**
 * Draws a panel on the end side, as wide as the recipe says and folding as the panel says.
 *
 * @param props - How it folds and closes, and what it holds.
 * @returns The panel, on the end side.
 */
export function Aside(props: AsideProps): ReactElement {
  return <Panel side="end" {...props} />;
}
