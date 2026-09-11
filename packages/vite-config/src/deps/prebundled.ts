/**
 * Naming the dependencies the dev server cannot find by crawling.
 */

import { contribute, type Contribution } from "@stealthscale/config-core";

/**
 * Where a contribution to the list of what is pre-bundled lands.
 */
const AT = "optimizeDeps.include";

/**
 * Describes dependencies the crawler will not reach on its own.
 */
export interface Prebundled {
  /**
   * Why the crawler misses them, kept with the contribution so a later reader can weigh it.
   */
  because: string;

  /**
   * The specifiers, each as it is imported. A deep import is named in full, and a glob reaches a
   * family of them.
   */
  deps: readonly string[];
}

/**
 * Pre-bundles a dependency the dev server would otherwise find halfway through a session.
 *
 * The server converts every dependency to one ES module up front, so a package shipping a hundred
 * files is one request rather than a hundred. It finds them by crawling from the page, which
 * reaches everything the page imports statically and nothing else: a dependency imported only
 * behind a dynamic import, or only from a module a plugin produces, is discovered when something
 * first asks for it — and discovering one mid-session means re-optimising and reloading the page
 * under whoever was using it.
 *
 * One contribution per specifier, each named for the specifier it carries, so a later module can
 * take back exactly one rather than the set.
 *
 * @param stated - The specifiers, and why the crawler misses them.
 * @returns One contribution for each specifier.
 */
export function prebundled(stated: Prebundled): readonly Contribution[] {
  return stated.deps.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `deps.prebundled(${held})` }),
  );
}
