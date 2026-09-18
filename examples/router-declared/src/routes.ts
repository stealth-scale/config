/**
 * Builds the tree from this application's own routes and the ones that arrived as data.
 */

import {
  type AnyRoute,
  compileRoutes,
  createAppRootRoute,
  createRoute,
  createRouter,
  namedRoute,
  Outlet,
  type RouteDeclaration,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { type Condition } from "#catalogue.ts";
import { LAYOUTS } from "#layouts.ts";
import { shellOf } from "#shell.tsx";

/**
 * Builds the tree over one set of declarations.
 *
 * @remarks
 *   A function rather than a module constant, because the tree is a function of the declarations.
 *   Calling it twice returns two trees that share no route, which is what lets one process serve
 *   two sets. Compiling into a tree a router has already been built from would not.
 * @param declarations - The routes that arrived as data.
 * @returns The tree a router is built from.
 */
export function buildTree(declarations: ReadonlyArray<RouteDeclaration<Condition>>): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });
  const shell = createRoute({
    ...namedRoute("app.shell"),
    component: shellOf(declarations),
    getParentRoute: () => root,
    path: "/app",
  });
  const compiled = compileRoutes(declarations, { layouts: LAYOUTS, parent: shell });

  return root.addChildren([shell.addChildren([...compiled])]);
}

/**
 * Builds a router over one set of declarations.
 *
 * @param declarations - The routes that arrived as data.
 * @returns The router.
 */
export function routed(
  declarations: ReadonlyArray<RouteDeclaration<Condition>>,
): ReturnType<typeof createRouter<AnyRoute>> {
  const tree = buildTree(declarations);

  return createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
}
