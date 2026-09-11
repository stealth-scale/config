/**
 * What this application draws where the other application's module goes.
 */

import { type ReactElement, Suspense } from "react";

import { Dashboard } from "#dashboard.tsx";

/**
 * Draws the module fetched from the other application.
 *
 * Behind a boundary, because the entry is fetched over the network the first time somebody
 * navigates here. What the boundary shows is what this route looks like on a slow connection, and
 * what it shows if the other application is not deployed.
 *
 * @returns The element.
 */
export function Reports(): ReactElement {
  return (
    <Suspense fallback={"Loading the other application."}>
      <Dashboard count={3} />
    </Suspense>
  );
}
