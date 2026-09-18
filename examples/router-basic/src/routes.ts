/**
 * Puts this application's pages at their addresses and builds the tree a router is made from.
 */

import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";

import { Invoice } from "#invoice.tsx";
import { Invoices } from "#invoices.tsx";
import { tabOf } from "#tab.ts";

/**
 * The route every page hangs beneath.
 */
const root = createRootRoute({ component: Outlet });

/**
 * The address the list of invoices is served at.
 */
const invoices = createRoute({
  component: Invoices,
  getParentRoute: () => root,
  path: "/invoices",
});

/**
 * The address one invoice is served at, reading which tab is open out of the search string.
 */
const invoice = createRoute({
  component: Invoice,
  getParentRoute: () => invoices,
  path: "$id",
  validateSearch: tabOf,
});

/**
 * The tree a router is built from.
 */
export const routeTree = root.addChildren([invoices.addChildren([invoice])]);

/**
 * The type the library works every path, parameter and search key out from.
 */
export type Routed = ReturnType<typeof createRouter<typeof routeTree>>;

/**
 * Builds a router over this application's pages.
 *
 * @remarks
 *   Each call builds a router of its own, with its own history and its own matched route. Two
 *   callers sharing one would navigate each other, which a specification needs and a browser never
 *   wants.
 * @returns The router.
 */
export function routed(): Routed {
  return createRouter({ defaultPreload: "intent", routeTree, scrollRestoration: true });
}

declare module "@tanstack/react-router" {
  /**
   * Registers this application's router, which is where the library reads its paths from.
   */
  interface Register {
    /**
     * The router every typed hook and every `Link` in this application is checked against.
     */
    router: Routed;
  }
}
