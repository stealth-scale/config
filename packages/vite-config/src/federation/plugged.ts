/**
 * Resolves the federation plugin, which this package depends on only optionally.
 *
 * @remarks
 *   A repository that federates nothing should not carry a bundler plugin it
 *   never runs, so the package is an optional peer and the import waits until a
 *   layer actually needs it.
 */

/**
 * Describes the options the federation plugin accepts.
 *
 * @remarks
 *   The shape is read off the plugin rather than restated here, so a change to
 *   the plugin's own options is a type error in this package instead of a
 *   mismatch nobody notices until a build runs.
 */
type Federating = Parameters<typeof import("@module-federation/vite").federation>[0];

/**
 * Mirrors what the federation plugin returns once it is configured.
 */
type Federated = ReturnType<typeof import("@module-federation/vite").federation>;

/**
 * Stands for the plugin package a loader resolves.
 *
 * @remarks
 *   A test supplies its own loader so the suite runs without the optional peer
 *   installed, and this is the shape such a loader has to satisfy.
 */
export type Loaded = typeof import("@module-federation/vite");

/**
 * Configures the federation plugin, resolving its package on first use.
 *
 * @remarks
 *   A missing install and a rejected set of options both fail here, and only the
 *   first is rewritten. An error the plugin raises about the options travels on
 *   untouched, so a typo is not reported as a dependency that was never
 *   installed.
 * @param stated - The options handed straight to the plugin.
 * @param load - Resolves the plugin package. A caller overrides it to avoid
 *   depending on the optional peer.
 * @returns The bundler plugins the options configure.
 * @throws {@link Error} When the plugin package cannot be resolved.
 */
export async function plugged(
  stated: Federating,
  load: () => Promise<Loaded> = () => import("@module-federation/vite"),
): Promise<Federated> {
  let loaded: Loaded;

  try {
    loaded = await load();
  } catch {
    throw new Error(
      "federation.host() and federation.remote() need @module-federation/vite installed. It is " +
        "an optional peer, because a repository that federates nothing should not carry a " +
        "bundler plugin it never runs.",
    );
  }

  return loaded.federation(stated);
}
