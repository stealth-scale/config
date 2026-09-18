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
  redirect,
  type RouteDeclaration,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { type Condition } from "#catalogue.ts";
import { LAYOUTS } from "#layouts.ts";
import { shellOf } from "#shell.tsx";

/**
 * The path this application mounts everything it draws under.
 */
const MOUNTED = "/app";

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
    path: MOUNTED,
  });
  const home = createRoute({
    beforeLoad: () => {
      // The library's own redirect, which is a response rather than an Error subclass.
      // eslint-disable-next-line typescript/only-throw-error -- see above
      throw redirect({ to: MOUNTED });
    },
    getParentRoute: () => root,
    path: "/",
  });
  const compiled = compileRoutes(declarations, { layouts: LAYOUTS, parent: shell });

  return root.addChildren([home, shell.addChildren([...compiled])]);
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
