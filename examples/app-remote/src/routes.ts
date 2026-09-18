/**
 * States where this deployment's pages belong, for whichever host draws them.
 *
 * @remarks
 *   The host decides where to mount these, and the path here is relative to that. What this
 *   deployment owns is the id, the shape of the path and which module draws it. A host that
 *   re-places them moves every link to them at once, because a link names the id.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

/**
 * Points at the dashboard this deployment draws.
 */
export const dashboard = { id: "remote.dashboard" };

/**
 * Returns the pages this deployment contributes.
 *
 * @remarks
 *   The page is stated behind an importer, so a host loads its chunk when somebody first opens it
 *   rather than when the host boots.
 * @returns One declaration per page.
 */
export function routes(): readonly RouteDeclaration[] {
  return [
    {
      component: { export: "Reports", load: () => import("#reports.tsx") },
      id: dashboard.id,
      navigation: { label: "Reports" },
      path: "/reports",
    },
  ];
}
