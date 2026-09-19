/**
 * Draws one block of destinations under a heading.
 *
 * @remarks
 *   The element is `nav`, and it names itself from its own heading, so a reader jumping by landmark
 *   hears `Workspace` and `Account` rather than two unnamed navigations. A block without a heading
 *   points at nothing, which resolves to no name, so state `aria-label` on one that draws none.
 *   The identifier is derived rather than registered. A heading that told the block it existed
 *   would be writing state from an effect, which React 19 reports, and the block would draw once
 *   without a name before a second render gave it one.
 */

import { type ComponentProps, type ReactElement, useId, useMemo } from "react";

import { withContext } from "#sidebar/context.ts";
import { NavProvider } from "#sidebar/state.ts";

/**
 * Draws the block at the room the column states.
 */
const Blocked = withContext("nav", "nav");

/**
 * Describes what a block takes.
 */
export type NavProps = Omit<ComponentProps<typeof Blocked>, "aria-labelledby">;

/**
 * Gathers destinations under one heading, and names itself by it.
 *
 * @param props - Everything a styled nav takes, less the reference it states itself.
 * @returns The block, named by its heading.
 */
export function Nav(props: NavProps): ReactElement {
  const labelId = useId();
  const state = useMemo(() => ({ labelId }), [labelId]);

  return (
    <NavProvider value={state}>
      <Blocked aria-labelledby={labelId} {...props} />
    </NavProvider>
  );
}
