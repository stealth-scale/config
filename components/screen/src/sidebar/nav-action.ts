/**
 * Draws the control beside a block's heading.
 *
 * @remarks
 *   What acts on the whole block: add a project, collapse the section, open its settings. It leaves
 *   a collapsed sidebar, because a rail has no room beside a mark and whatever it does is reachable
 *   from the page the rail leads to.
 *   Name it. `Add` says nothing about what it adds to; `Add project` does.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the control at the end of the heading's row.
 */
export const NavAction = withContext("button", "navAction", {
  defaultProps: { type: "button" },
});

/**
 * Describes what the control takes.
 */
export type NavActionProps = ComponentProps<typeof NavAction>;
