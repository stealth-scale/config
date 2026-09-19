/**
 * Draws the panel on the start side, which is where an application keeps its navigation.
 *
 * @remarks
 *   The element carries no landmark. What the panel holds says what it is: a sidebar's blocks of
 *   destinations each name their own navigation, so a reader jumping by landmark hears `Workspace`
 *   and `Account` rather than one nameless region around them.
 */

import { type ReactElement } from "react";

import { Panel, type PanelProps } from "#app-shell/panel.tsx";

/**
 * Describes what the start panel takes.
 */
export type NavbarProps = Omit<PanelProps, "side">;

/**
 * Draws a panel on the start side, as wide as the recipe says and folding as the panel says.
 *
 * @param props - How it folds and closes, and what it holds.
 * @returns The panel, on the start side.
 */
export function Navbar(props: NavbarProps): ReactElement {
  return <Panel side="start" {...props} />;
}
