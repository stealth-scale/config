/**
 * Declares a dependency the scan cannot find by reading imports statically.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

/**
 * Directs every contribution here at the list of specifiers Vite converts up front.
 */
const AT = "optimizeDeps.include";

/**
 * Gathers the specifiers to convert up front with the reason the scan overlooks each one.
 */
export interface Prebundled {
  /**
   * Records what hides these imports from a static read of the source.
   */
  because: string;

  /**
   * Repeats each specifier exactly as an import writes it, deep subpath and all.
   */
  deps: readonly string[];
}

/**
 * Converts each specifier to ESM up front, whether or not the scan turned it up.
 *
 * @remarks
 *   A dependency reached only through a dynamic `import()` or a computed
 *   specifier is discovered mid-session, and the discovery costs a page reload.
 *   A specifier named here is dealt with before the server answers anything.
 * @returns One contribution per specifier, and nothing at all for an empty list.
 */
export function prebundle(stated: Prebundled): readonly Contribution[] {
  return stated.deps.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `deps.prebundle(${held})` }),
  );
}
