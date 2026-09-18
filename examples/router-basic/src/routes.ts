/**
 * Puts this application's pages at their addresses and builds the tree a router is made from.
 */

import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";

import { Invoice } from "#invoice.tsx";
import { Invoices } from "#invoices.tsx";
import { tabOf } from "#tab.ts";

/**
 * The route every page hangs beneath.
 */
const root = createRootRoute({ component: Outlet });

/**
 * The site root, which holds no page of its own and sends a visitor to the list.
 */
const home = createRoute({
  beforeLoad: () => {
    // The library's own redirect, which is a response rather than an Error subclass.
    // eslint-disable-next-line typescript/only-throw-error -- see above
    throw redirect({ to: "/invoices" });
  },
  getParentRoute: () => root,
  path: "/",
});

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
export const routeTree = root.addChildren([home, invoices.addChildren([invoice])]);

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
