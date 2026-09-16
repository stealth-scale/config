/**
 * Pulls a dependency into the server bundle instead of leaving the runtime to load it.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

/**
 * Addresses the key listing the dependencies kept out of the externals list.
 */
const AT = "ssr.noExternal";

/**
 * Collects the dependencies a server bundle has to contain, with the reason it has to.
 */
export interface Bundled {
  /**
   * Records what the runtime cannot do with these packages, for whoever later removes the layer.
   */
  because: string;

  /**
   * Lists the package specifiers to pull in.
   */
  deps: readonly string[];
}

/**
 * Compiles each named dependency into the server bundle.
 *
 * @remarks
 *   A package that ships only ESM, or one importing a stylesheet, cannot be
 *   loaded by the server runtime as it stands. Each dependency becomes a layer
 *   of its own, so a repository can take one back without restating the rest.
 * @returns One contribution per dependency, in the order they were given.
 */
export function bundle(stated: Bundled): readonly Contribution[] {
  return stated.deps.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `ssr.bundle(${held})` }),
  );
}
