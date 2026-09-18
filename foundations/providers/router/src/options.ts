/**
 * Collects what every router in this design system starts from, as an object a caller spreads.
 */

import { routerDefaults } from "#defaults.ts";
import { type RouteMap } from "#map.ts";

/**
 * Describes the one member this package expects a router's context to carry.
 *
 * @remarks
 *   A component resolves a declared id through the router's own context rather than through a
 *   provider of this package's own, so an application mounts nothing extra to make a declared link
 *   work.
 */
export interface RoutesContext {
  /**
   * Every declared id, against the route compiled for it.
   */
  readonly routes?: RouteMap | undefined;
}

/**
 * Describes the options a caller spreads into `createRouter`.
 */
export type AppRouterOptions<Context extends object> = {
  /**
   * The context the router hands every loader and every route component.
   */
  readonly context: Context;
} & typeof routerDefaults;

/**
 * Collects the options every router in this design system starts from.
 *
 * @remarks
 *   An object to spread rather than a factory that calls `createRouter`. The library states
 *   forty-eight router options, and a factory would expose the few it thought of and hide the rest.
 *   Spreading leaves every one of them the caller's to set, the four stated here included.
 * @param context - The context the router hands a loader, holding the route map where a caller compiled
 *   declarations.
 * @returns The options, to spread into `createRouter` before the caller's own.
 */
export function routerOptions<Context extends object>(context: Context): AppRouterOptions<Context> {
  return { ...routerDefaults, context };
}
