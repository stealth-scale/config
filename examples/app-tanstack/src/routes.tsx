/**
 * The routes this application answers, and what sits at each.
 */

import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";

import { Home } from "#home.tsx";
import { Reports } from "#reports.tsx";

/**
 * What every route sits under.
 */
const root = createRootRoute({
  component: Outlet,
});

/**
 * What this application draws at its own address.
 */
const home = createRoute({ component: Home, getParentRoute: () => root, path: "/" });

/**
 * What it draws where the other application's module goes.
 */
const reports = createRoute({ component: Reports, getParentRoute: () => root, path: "/reports" });

/**
 * Every path this application answers.
 *
 * Named apart from the router so a specification can read the tree without starting one.
 */
export const PATHS = ["/", "/reports"] as const;

/**
 * Every route, under the one they share.
 */
const tree = root.addChildren([home, reports]);

/**
 * The router this application runs on, as the library types it over this tree.
 */
export type Routed = ReturnType<typeof createRouter<typeof tree>>;

/**
 * Builds the router.
 *
 * A function rather than a value, so that nothing is constructed by importing this file and a
 * specification gets a router of its own rather than one another test has already navigated.
 *
 * @returns The router, ready to be handed to the provider.
 */
export function routed(): Routed {
  return createRouter({ routeTree: tree });
}
