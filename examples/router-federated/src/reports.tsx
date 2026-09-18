/**
 * Gives the other deployment's dashboard a page to appear on.
 */

import { type ReactElement, Suspense } from "react";

import { Dashboard } from "#dashboard.ts";

/**
 * Draws the remote dashboard, and a line of text until it arrives.
 *
 * @remarks
 *   Every first visit to this route waits on the network, so the fallback is what a visitor reads
 *   rather than an edge case. The count is fixed here because the route parses no parameters.
 */
export function Reports(): ReactElement {
  return (
    <Suspense fallback={"Loading the other application."}>
      <Dashboard count={3} />
    </Suspense>
  );
}
