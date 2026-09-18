/**
 * Puts each of the application's pages at an address and builds the router over them.
 */

import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";

import { Home } from "#home.tsx";
import { Reports } from "#reports.tsx";

/**
 * The route every page hangs beneath.
 *
 * @remarks
 *   Rendering the outlet alone puts no shell around a page, so the matched child owns the whole
 *   document body and a remote module is free to draw its own frame.
 */
const root = createRootRoute({
  component: Outlet,
});

/**
 * The address of the page this application serves itself.
 */
const home = createRoute({ component: Home, getParentRoute: () => root, path: "/" });

/**
 * The address the other deployment's dashboard is reached at.
 */
const reports = createRoute({ component: Reports, getParentRoute: () => root, path: "/reports" });

/**
 * Every address this application answers on.
 */
export const PATHS = ["/", "/reports"] as const;

/**
 * The tree a router is built from, holding each page under the root.
 */
const tree = root.addChildren([home, reports]);

/**
 * A router over this application's pages.
 *
 * @remarks
 *   The type carries the tree, so a link to an address no route declares is a compile error rather
 *   than a blank page at runtime.
 */
export type Routed = ReturnType<typeof createRouter<typeof tree>>;

/**
 * Builds a router serving every page in the tree.
 *
 * @remarks
 *   Each call hands back a router of its own, with its own history and its own matched route. Two
 *   callers sharing one would navigate each other, which is what a test needs and what a browser
 *   never wants.
 */
export function routed(): Routed {
  return createRouter({ routeTree: tree });
}
