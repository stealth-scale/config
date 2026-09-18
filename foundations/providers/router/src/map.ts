/**
 * Reads the routes a tree names, whoever built them.
 */

import { type DeclaredRoute } from "#declaration.ts";
import { declaredOf } from "#declared.ts";
import { type AnyRoute, trimPath } from "#tanstack.ts";

/**
 * Every id anything links by, against the route that draws it.
 */
export type RouteMap = ReadonlyMap<string, AnyRoute>;

/**
 * Carries a route's name where the library hands it back on every match.
 */
export interface StaticName {
  /**
   * The static data the route carries, which `declaredOf` reads the name out of.
   */
  readonly staticData: Readonly<Record<"declared", DeclaredRoute>>;
}

/**
 * Gives a route written in code the id everything else links to it by.
 *
 * @remarks
 *   A route carries its id in `staticData`, which is where the compiler writes the id of a route
 *   built from a declaration. One mechanism names both, so a link does not need to know which of
 *   the two it is pointing at.
 * @param id - The id to name the route under.
 * @returns The static data to spread into `createRoute`.
 */
export function namedRoute(id: string): StaticName {
  return { staticData: { declared: { id } } };
}

/**
 * Reads every id a tree names, against the route that draws it.
 *
 * @remarks
 *   Derived from the tree rather than collected beside it, so a route written in code and a route
 *   built from a declaration reach the map the same way. The walk also reports two routes that
 *   serve one URL, which a development build reports as a duplicate route and a production build
 *   resolves by keeping the first and dropping the rest in silence.
 * @param tree - The assembled tree, as `createRouter` takes it.
 * @returns Every id, against its route.
 * @throws {@link Error} Where two routes carry one id, or where two serve one path under a shared
 *   parent.
 */
export function routeMap(tree: AnyRoute): RouteMap {
  const named = new Map<string, AnyRoute>();

  collect(tree, named);

  return named;
}

/**
 * Walks a route's descendants, naming each one and refusing a repeated path.
 *
 * @param route - The route whose children are read.
 * @param named - The map built so far.
 * @throws {@link Error} Where two routes carry one id, or where two serve one path here.
 */
function collect(route: AnyRoute, named: Map<string, AnyRoute>): void {
  const claimed = new Set<string>();

  for (const path of pathsUnder(route)) {
    if (claimed.has(path)) {
      throw new Error(`Two routes serve the path ${path} under the same parent.`);
    }

    claimed.add(path);
  }

  for (const child of childrenOf(route)) {
    identify(child, named);
    collect(child, named);
  }
}

/**
 * Records the id a route carries, where it carries one.
 *
 * @param route - The route to read.
 * @param named - The map built so far.
 * @throws {@link Error} Where another route already carries the same id.
 */
function identify(route: AnyRoute, named: Map<string, AnyRoute>): void {
  const options: object = route.options;
  const data: unknown = "staticData" in options ? options.staticData : undefined;
  const declared =
    typeof data === "object" && data !== null ? declaredOf({ staticData: data }) : undefined;

  if (declared === undefined) return;

  if (named.has(declared.id)) {
    throw new Error(`Two routes are named ${declared.id}.`);
  }

  named.set(declared.id, route);
}

/**
 * Writes a path the one way the library reads it: the slashes around it trimmed, and one leading
 * slash put back.
 *
 * @remarks
 *   `home`, `/home` and `home/` are one route to the library, so the check reads all three as
 *   `/home`.
 */
function normalised(path: string): string {
  const trimmed = trimPath(path);

  return trimmed === "/" ? trimmed : `/${trimmed}`;
}

/**
 * Lists the paths a route's descendants serve at its own level, each written the one way the
 * library reads it.
 *
 * @remarks
 *   A pathless route consumes no segment of a URL, so whatever sits below one is served at the
 *   level of the route above it. The walk goes through a pathless route rather than stopping at
 *   it.
 * @param route - The route whose level is being read.
 * @returns One path per descendant served at this level.
 */
function pathsUnder(route: AnyRoute): readonly string[] {
  const paths: string[] = [];

  for (const child of childrenOf(route)) {
    const options: object = child.options;
    const path: unknown = "path" in options ? options.path : undefined;

    if (typeof path === "string") paths.push(normalised(path));
    else paths.push(...pathsUnder(child));
  }

  return paths;
}

/**
 * Reads the children a route holds.
 *
 * @remarks
 *   The library types a route's children as `any`, because a typed tree names each one. Nothing
 *   here reads more than the options every route carries.
 * @param route - The route to read.
 * @returns Its children, or none where it holds none.
 */
function childrenOf(route: AnyRoute): readonly AnyRoute[] {
  // eslint-disable-next-line typescript/no-unsafe-return -- see above
  return route.children ?? [];
}
