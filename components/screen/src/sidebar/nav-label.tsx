/**
 * Draws the heading naming a block of destinations.
 *
 * @remarks
 *   It carries the identifier the block points at, so writing this part is what names the landmark
 *   and a caller states no identifier.
 *   On a collapsed sidebar the words go out of sight rather than out of the document, so the block
 *   keeps its name for a screen reader while the rail shows marks alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#sidebar/context.ts";
import { useNav } from "#sidebar/state.ts";

/**
 * Draws the heading at the size the column states.
 */
const Headed = withContext("h2", "navLabel");

/**
 * Describes what a heading takes, less the identifier the block gives it.
 */
export type NavLabelProps = Omit<ComponentProps<typeof Headed>, "id">;

/**
 * Labels a block of destinations, and names its landmark by doing so.
 *
 * @param props - Everything a styled heading takes, less its identifier.
 * @returns The heading, carrying the identifier the block points at.
 */
export function NavLabel(props: NavLabelProps): ReactElement {
  const nav = useNav();

  return <Headed {...props} id={nav.labelId} />;
}
