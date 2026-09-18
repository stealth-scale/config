/**
 * Builds the root route an application's tree starts from, typed for this design system's context.
 */

import { type RoutesContext } from "#options.ts";
import { createRootRouteWithContext } from "#tanstack.ts";

/**
 * Builds a root route whose context holds whatever the application states and the route map.
 *
 * @remarks
 *   Calling the library's `createRootRoute` instead leaves the context typed as empty, and the
 *   first sign of it is `createRouter` refusing the options `routerOptions` returned. The error
 *   then names the router rather than the root, which is the file that has to change.
 * @returns The root route factory, to call with the route's own options.
 */
export function createAppRootRoute<Context extends object = RoutesContext>(): ReturnType<
  typeof createRootRouteWithContext<Context>
> {
  return createRootRouteWithContext<Context>();
}
