/**
 * Draws this deployment's dashboard as a page a host can route to.
 */

import { type ReactElement } from "react";

import { Dashboard } from "#dashboard.tsx";

/**
 * Draws the dashboard with the count this page reports on.
 *
 * @remarks
 *   The dashboard takes a count and a route component takes no props, so this page is what stands
 *   between them. A host routes to this and knows nothing of the count.
 * @returns The page.
 */
export function Reports(): ReactElement {
  return <Dashboard count={3} />;
}
