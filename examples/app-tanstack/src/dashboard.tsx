/**
 * The other application's component, as this one reaches it.
 */

import { lazy } from "react";

/**
 * Fetched when a route first draws it.
 *
 * Behind the route rather than beside it, so the entry is fetched when somebody navigates there and
 * not while the first page is loading. That is most of what putting a remote behind a router buys:
 * the two applications are deployed apart and now they are loaded apart as well.
 */
export const Dashboard = lazy(async () => {
  const held = await import("remote/Dashboard");

  return { default: held.Dashboard };
});
