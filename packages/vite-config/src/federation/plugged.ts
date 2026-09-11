/**
 * Reaching the federation plugin, which a repository installs only if it federates.
 */

/**
 * What the plugin is called with, as the package that ships it declares.
 */
type Federating = Parameters<typeof import("@module-federation/vite").federation>[0];

/**
 * What it answers.
 */
type Federated = ReturnType<typeof import("@module-federation/vite").federation>;

/**
 * The package that ships the plugin, as far as this module reads it.
 */
export type Loaded = typeof import("@module-federation/vite");

/**
 * Builds the federation plugin, importing it at the moment a config asks for one.
 *
 * `@module-federation/vite` is an optional peer, so importing it at the top of a module makes it
 * required in practice: the barrel is what every consumer loads, and a static import in anything
 * the barrel re-exports fails the load for a repository that federates nothing. Reaching for it
 * here means only a config that states a host or a remote has to have it installed.
 *
 * Only the import is guarded. The plugin's own complaint about the options it was handed is the
 * answer a caller needs, and reporting it as a missing package would send them to install something
 * they already have.
 *
 * Which loader it calls is an argument so that the failure a repository without that package meets
 * is reachable from a specification here, where it is installed.
 *
 * @param stated - The plugin's own options, passed through.
 * @param load - How to reach the package. The real import unless a specification says otherwise.
 * @returns The plugin, once the package has loaded.
 * @throws Error Where the optional package is not installed.
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
