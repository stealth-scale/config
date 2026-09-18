/**
 * Puts every page the plugin indexed at an address, and builds the router over them.
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
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";
import { declarations, type Indexed, layouts } from "@stealthscale/specimen";

/**
 * The path this application mounts the catalogue under.
 *
 * @remarks
 *   The site root, because this application draws nothing else. A consumer mounting the same pages
 *   beside their own moves this and every address follows, which is what the declarations carrying
 *   no leading slash buys.
 */
const MOUNTED = "/pages";

/**
 * The identifier of the route the pages hang beneath.
 */
const UNDER = "docs.pages";

/**
 * Builds the tree over one set of pages.
 *
 * @remarks
 *   A function rather than a module constant, because the tree is a function of the pages. Calling
 *   it twice returns two trees that share no route, which is what lets a specification build one
 *   without navigating the page beside it.
 * @param listed - The pages the index found.
 * @returns The tree a router is built from.
 */
export function buildTree(listed: readonly Indexed[]): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });
  const under = createRoute({
    ...namedRoute(UNDER),
    getParentRoute: () => root,
    path: MOUNTED,
  });
  const first = listed[0];
  const home = createRoute({
    beforeLoad: () => {
      // The library's own redirect, which is a response rather than an Error subclass.
      // eslint-disable-next-line typescript/only-throw-error -- see above
      throw redirect({ to: first === undefined ? MOUNTED : `${MOUNTED}/${first.id}` });
    },
    getParentRoute: () => root,
    path: "/",
  });
  const compiled = [...declarations(listed)];

  return root.addChildren([
    home,
    under.addChildren([...compileRoutes(compiled, { layouts: layouts(compiled), parent: under })]),
  ]);
}

/**
 * Builds a router over one set of pages.
 *
 * @param listed - The pages the index found.
 * @returns The router.
 */
export function routed(listed: readonly Indexed[]): ReturnType<typeof createRouter<AnyRoute>> {
  const tree = buildTree(listed);

  return createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
}
