/**
 * Defers the other deployment's dashboard until a route asks something to draw it.
 */

import { lazy } from "react";

/**
 * Fetches the remote dashboard the first time React renders it.
 *
 * @remarks
 *   The import is resolved over the network at runtime, so whatever renders this puts a Suspense
 *   boundary above it. A fetch that fails throws out of the render rather than drawing anything,
 *   and a chunk the other deployment has since replaced is what the reload watch listens for.
 */
export const Dashboard = lazy(async () => {
  const held = await import("remote/Dashboard");

  return { default: held.Dashboard };
});
