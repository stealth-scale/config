/**
 * Stands in for the pages the other deployment declares while tests run.
 *
 * @remarks
 *   The test runner has no second deployment to fetch declarations from, and the federation layer
 *   aliases `remote/routes` here instead. Nothing imports this module directly, and no build of the
 *   application includes it.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

/**
 * Draws what the stand-in page shows.
 *
 * @returns The page, as plain text a case reads off the screen.
 */
function Reports(): string {
  return "3 open";
}

/**
 * Returns what the other deployment would declare.
 *
 * @remarks
 *   The path matches the real one, because a case checks that this application mounts the page
 *   where the declaration asked rather than where this application chose.
 * @returns One declaration, for the dashboard page.
 */
export function routes(): readonly RouteDeclaration[] {
  return [
    {
      component: Reports,
      id: "remote.dashboard",
      navigation: { label: "Reports" },
      path: "/reports",
    },
  ];
}
