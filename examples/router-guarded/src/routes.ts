/**
 * Builds the tree for one session, so what a person may reach follows who they are.
 */

import {
  type AnyRoute,
  compileRoutes,
  createAppRootRoute,
  createRoute,
  createRouter,
  namedRoute,
  Outlet,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { catalogue } from "#catalogue.ts";
import { evaluator } from "#evaluate.ts";
import { type Session } from "#session.ts";
import { SignIn } from "#sign-in.tsx";

/**
 * Builds the tree for one session.
 *
 * @remarks
 *   A condition decides whether a route is routed, not whether it is compiled. Every page is in the
 *   tree whoever is reading, and the evaluator runs when somebody opens one. A session that changes
 *   therefore needs no rebuild, and a menu that should list fewer pages filters the declarations
 *   itself.
 * @param session - Who is reading.
 * @returns The tree a router is built from.
 */
export function buildTree(session: Session): AnyRoute {
  const root = createAppRootRoute()({ component: Outlet });
  const signIn = createRoute({
    ...namedRoute("app.signIn"),
    component: SignIn,
    getParentRoute: () => root,
    path: "/sign-in",
  });
  const compiled = compileRoutes(catalogue(), { evaluate: evaluator(session), parent: root });

  return root.addChildren([signIn, ...compiled]);
}

/**
 * Builds a router for one session.
 *
 * @param session - Who is reading.
 * @returns The router.
 */
export function routed(session: Session): ReturnType<typeof createRouter<AnyRoute>> {
  const tree = buildTree(session);

  return createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
}
