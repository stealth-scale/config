/**
 * Reaches the component another application exposes, under the name this one registered it as.
 */

import { lazy } from "react";

/**
 * Draws the remote's dashboard, fetching it the first time the page renders it.
 *
 * @remarks
 *   The `remote/` prefix is neither a package nor a path. Nothing resolves it during the build, and
 *   the entry is fetched from wherever that application is deployed when this import is first
 *   reached. A render outside a Suspense boundary therefore throws.
 */
export const Dashboard = lazy(async () => {
  const held = await import("remote/Dashboard");

  return { default: held.Dashboard };
});
