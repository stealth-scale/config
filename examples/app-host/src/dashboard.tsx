/**
 * The other application's component, as this one reaches it.
 */

import { lazy } from "react";

/**
 * Fetched when the page first draws it.
 *
 * `remote/` is the name this application gave that remote in its config, not a package and not a
 * path: nothing resolves it at build time, and the entry is fetched from wherever the remote is
 * deployed when this import is first reached.
 */
export const Dashboard = lazy(async () => {
  const held = await import("remote/Dashboard");

  return { default: held.Dashboard };
});
