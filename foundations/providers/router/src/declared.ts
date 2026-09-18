/**
 * Reads the declaration a matched route was compiled from.
 */

import { type DeclaredRoute } from "#declaration.ts";
import { type AnyParams, idOf, type RouteRef } from "#reference.ts";
import { useMatches } from "#tanstack.ts";

/**
 * Describes the part of a match this package reads.
 */
export interface MatchedRoute {
  /**
   * The data the route was given to carry, which the library hands back untouched.
   */
  readonly staticData: object;
}

/**
 * Describes a match the hooks read, which carries its parameters as well as its data.
 */
interface MatchedPage extends MatchedRoute {
  /**
   * The path parameters the matched route's own path named.
   */
  readonly params: AnyParams;
}

/**
 * Describes the declared page a person is looking at.
 */
interface Drawn {
  /**
   * The id it was declared under, or nothing where no declared route is matched.
   */
  readonly id?: string | undefined;

  /**
   * The parameters its path named.
   */
  readonly params: AnyParams;
}

/**
 * Reads the id and the menu entry a matched route carries, or nothing where it carries neither.
 *
 * @remarks
 *   A route carries its id in `staticData`, which is where the library keeps whatever a route wants
 *   to carry. The compiler writes it for a route built from a declaration and `namedRoute` writes
 *   it for one written in code, so a menu, a breadcrumb or a telemetry hook reads what it needs off
 *   the match either way. The shape is checked rather than trusted, because `staticData` is untyped
 *   by design and a route may carry anything under the same name. The checked object itself is
 *   returned, so every read of one route gives one reference.
 * @param match - A match, as `useMatches` returns one.
 * @returns The id and the menu entry it carries, or nothing.
 */
export function declaredOf(match: MatchedRoute): DeclaredRoute | undefined {
  const { staticData } = match;
  const data: unknown = "declared" in staticData ? staticData.declared : undefined;

  if (typeof data !== "object" || data === null) return undefined;
  if (!("id" in data) || typeof data.id !== "string") return undefined;

  // The check above establishes the one member this package reads, and `navigation` is whatever the
  // host declared it to be.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return data as DeclaredRoute;
}

/**
 * Reads the name the deepest named route the page is on goes by.
 *
 * @remarks
 *   The deepest match rather than the first, because a named route nested under another is the page
 *   a person is looking at. A page drawn entirely from unnamed routes returns nothing.
 *   The selector returns the object the route carries rather than a copy of it. A route's static
 *   data is fixed once the tree is built, so the reference is the same one until a different route
 *   matches, and a navigation that left the page alone re-renders nothing.
 * @returns The id and the menu entry, or nothing where no matched route carries either.
 */
export function useDeclaredRoute(): DeclaredRoute | undefined {
  return useMatches({ select: (matches) => declaredIn(matches) });
}

/**
 * Reads the parameters of the page being drawn, typed by the reference the caller holds.
 *
 * @remarks
 *   A compiled route is outside the tree an application registered, so `useParams` types against a
 *   tree the route is not in. The parameters are read off the match instead, and the reference
 *   carries their names. This checks at run time that the page really is the route the reference
 *   names before it makes the claim.
 *   The selector returns the id and the parameters alone, which are strings. Structural sharing
 *   compares them, so a navigation that changed neither re-renders nothing.
 * @param to - A reference to the route the calling component draws.
 * @returns The parameters the route's path named.
 * @throws {@link Error} Where the page being drawn is not the route the reference names.
 */
export function useRouteParams<Params extends AnyParams>(to: RouteRef<Params>): Params {
  const drawn = useMatches({ select: (matches) => drawnIn(matches), structuralSharing: true });
  const wanted = idOf(to);

  if (drawn.id !== wanted) {
    throw new Error(
      `The page being drawn is not ${wanted}, so its parameters are not that route's.`,
    );
  }

  // The reference names the parameters and the check above establishes that this page is that
  // route, which is what makes the narrowing true.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return drawn.params as Params;
}

/**
 * Reads the name the deepest matched route that carries one goes by.
 *
 * @param matches - Every matched route, outermost first.
 * @returns The id and the menu entry it carries, or nothing where no match carries an id.
 */
function declaredIn(matches: readonly MatchedRoute[]): DeclaredRoute | undefined {
  let deepest: DeclaredRoute | undefined;

  for (const match of matches) {
    const declared = declaredOf(match);

    if (declared !== undefined) deepest = declared;
  }

  return deepest;
}

/**
 * Reads the id and the parameters of the deepest matched route that carries an id.
 *
 * @param matches - Every matched route, outermost first.
 * @returns The id and the parameters, with no id where none of them carries one.
 */
function drawnIn(matches: readonly MatchedPage[]): Drawn {
  let deepest: Drawn = { params: {} };

  for (const match of matches) {
    const declared = declaredOf(match);

    if (declared !== undefined) deepest = { id: declared.id, params: match.params };
  }

  return deepest;
}
