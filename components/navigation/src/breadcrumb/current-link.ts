/**
 * Draws the crumb naming the page a person is on.
 *
 * @remarks
 *   The element is `span` rather than `a`, because a link to the page already open gives a reader
 *   a control that does nothing. It states `aria-current="page"`, which is what tells a screen
 *   reader which crumb of the trail is where they are, and it is the last crumb of every trail.
 */

import { type ComponentProps } from "react";

import { withContext } from "#breadcrumb/context.ts";

/**
 * Draws the name of the page itself, at full strength against the muted crumbs above it.
 */
export const CurrentLink = withContext("span", "currentLink", {
  defaultProps: { "aria-current": "page" },
});

/**
 * Describes what the current crumb takes.
 */
export type CurrentLinkProps = ComponentProps<typeof CurrentLink>;
