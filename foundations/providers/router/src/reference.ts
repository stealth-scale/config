/**
 * Points at a route without naming a path, a module or an address.
 */

/**
 * The parameters a route names where its reference states none.
 */
export type AnyParams = Readonly<Record<string, string>>;

/**
 * Points at a route by the id it was declared under, carrying the parameters its path names.
 *
 * @remarks
 *   Stated structurally rather than imported, so a plugin SDK's own reference type satisfies it
 *   without this package depending on that SDK. A reference carries no path, because the path is
 *   whoever composed the application's to choose and a link written against one would move when
 *   they re-placed the route.
 *   The parameters live in the type alone. Nothing reads `~types` at run time, and it is there so
 *   a link to a route filling `id` is refused where the route names `invoice`.
 */
export interface RouteRef<Params extends AnyParams = AnyParams> {
  /**
   * The parameters, in the type alone.
   */
  readonly "~types"?: {
    /**
     * The parameters the route's path names, which a link fills.
     */
    readonly params: Params;
  };

  /**
   * The full id the route was declared under.
   */
  readonly id: string;
}

/**
 * Points at a route, either by a reference or by the bare id one carries.
 */
export type RouteTarget<Params extends AnyParams = AnyParams> = RouteRef<Params> | string;

/**
 * Reads the id a target names.
 *
 * @param to - A reference, or the bare id.
 * @returns The full id the route was declared under.
 */
export function idOf(to: RouteTarget): string {
  return typeof to === "string" ? to : to.id;
}
