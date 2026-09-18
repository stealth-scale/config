/**
 * Links to a route a manifest declared, which the application's own types do not know.
 */

import { type ComponentProps, type ReactNode } from "react";

import { useRouteHref } from "#href.ts";
import { type AnyParams, type RouteTarget } from "#reference.ts";
import { Link } from "#tanstack.ts";

/**
 * Describes a link to a declared route.
 *
 * @remarks
 *   Everything the library's own `Link` takes passes through, so a declared link is styled,
 *   labelled and given an active state the way any other link is. Only `to` and `params` are
 *   restated, because a declared id is not a path the compiler knows.
 */
export type RouteLinkProps<Params extends AnyParams = AnyParams> = {
  /**
   * The parameters the route's path names, typed by the reference where one was given.
   */
  readonly params?: Params | undefined;

  /**
   * A reference to the route, or the bare id one carries.
   */
  readonly to: RouteTarget<Params>;
} & Omit<ComponentProps<typeof Link>, "params" | "to">;

/**
 * Links to a route by the id a manifest declared it under.
 *
 * @remarks
 *   A declared route is outside the tree an application registered, so `Link` refuses its path at
 *   compile time. This resolves the id at run time and hands the library a plain string, which is
 *   the one place in this package where a path is not checked by the compiler.
 * @param props - The declared id, its parameters, and whatever else the library's `Link` takes.
 * @returns An anchor to the resolved path.
 */
export function RouteLink<Params extends AnyParams>({
  params,
  to,
  ...rest
}: RouteLinkProps<Params>): ReactNode {
  return <Link {...rest} to={useRouteHref(to, params)} />;
}
