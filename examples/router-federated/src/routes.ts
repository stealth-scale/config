/**
 * Builds the tree from this application's own page and the ones the other deployment declares.
 */

import {
  type AnyRoute,
  compileRoutes,
  createAppRootRoute,
  createRoute,
  createRouter,
  namedRoute,
  type RouteDeclaration,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { Home } from "#home.tsx";
import { shellOf } from "#shell.tsx";

/**
 * The id this application names its own page under.
 */
const HOME = "app.home";

/**
 * Builds the tree over whatever the other deployment declared.
 *
 * @remarks
 *   The address of the other deployment's page is not written here. It arrives with the
 *   declaration, so redeploying that application under a different path needs no build of this
 *   one.
 * @param declarations - The pages the other deployment contributes, or none where it is
 *   unreachable.
 * @returns The tree a router is built from.
 */
export function buildTree(declarations: readonly RouteDeclaration[]): AnyRoute {
  const root = createAppRootRoute()({ component: shellOf(declarations, HOME) });
  const home = createRoute({
    ...namedRoute(HOME),
    component: Home,
    getParentRoute: () => root,
    path: "/",
  });
  const compiled = compileRoutes(declarations, { parent: root });

  return root.addChildren([home, ...compiled]);
}

/**
 * Builds a router over this application's page and the other deployment's.
 *
 * @param declarations - The pages the other deployment contributes.
 * @returns The router.
 */
export function routed(
  declarations: readonly RouteDeclaration[],
): ReturnType<typeof createRouter<AnyRoute>> {
  const tree = buildTree(declarations);

  return createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
}
