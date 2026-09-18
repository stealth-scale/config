/**
 * Builds the tree every page hangs in, and the router this application is drawn from.
 */

import {
  type AnyRoute,
  compileRoutes,
  createAppRootRoute,
  createRoute,
  createRouter,
  namedRoute,
  redirect,
  routeHref,
  type RouteMap,
  routeMap,
  routerOptions,
} from "@stealthscale/provider-router";

import { catalogue, summary } from "#catalogue.ts";
import { evaluator } from "#evaluate.ts";
import { session } from "#session.ts";
import { Shell } from "#shell.tsx";
import { SignIn } from "#sign-in.tsx";

/**
 * The context this application's router hands every check it runs.
 *
 * @remarks
 *   The map is stated as required rather than optional, so a check reaching for it needs no guard.
 *   `routerOptions` is given one on every call below.
 */
interface Routes {
  /**
   * Every id this application names, against the route that draws it.
   */
  readonly routes: RouteMap;
}

/**
 * Builds the tree.
 *
 * @remarks
 *   A condition decides whether a route is routed, not whether it is compiled. Every page is in the
 *   tree whoever is reading, and the evaluator asks who that is when somebody opens one. A session
 *   that changes therefore needs no rebuild.
 * @returns The tree a router is built from.
 */
export function buildTree(): AnyRoute {
  const root = createAppRootRoute<Routes>()({ component: Shell });
  const home = createRoute({
    beforeLoad: ({ context }) => {
      // The library's own redirect, which is a response rather than an Error subclass.
      // eslint-disable-next-line typescript/only-throw-error -- see above
      throw redirect({ to: routeHref(context.routes, summary) });
    },
    getParentRoute: () => root,
    path: "/",
  });
  const signIn = createRoute({
    ...namedRoute("app.signIn"),
    component: SignIn,
    getParentRoute: () => root,
    path: "/sign-in",
  });
  const compiled = compileRoutes(catalogue(), { evaluate: evaluator(session), parent: root });

  return root.addChildren([home, signIn, ...compiled]);
}

/**
 * Builds a router over this application's pages.
 *
 * @returns The router.
 */
export function routed(): ReturnType<typeof createRouter<AnyRoute>> {
  const tree = buildTree();

  return createRouter({ ...routerOptions({ routes: routeMap(tree) }), routeTree: tree });
}
