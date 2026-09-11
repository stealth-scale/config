/**
 * Where the dev server starts looking for what to pre-bundle.
 */

import { contribute, type Contribution } from "@stealthscale/config-core";

/**
 * Where a contribution to the list of what is crawled lands.
 */
const AT = "optimizeDeps.entries";

/**
 * Describes where the crawl starts, beyond the pages it finds on its own.
 */
export interface Crawled {
  /**
   * Why these are not reached from a page, kept with the contribution so a later reader can weigh
   * it.
   */
  because: string;

  /**
   * The files to crawl from, as globs relative to the project root.
   */
  from: readonly string[];
}

/**
 * Crawls from a file the dev server would not have started at.
 *
 * Left alone the server starts at every `.html` it can find, which is right for an application
 * whose page imports everything it needs. It is wrong wherever the real entry is not a page: a
 * story kit loading a preview module, a worker started from a URL, a package whose page is built by
 * something else. What those import is then discovered one module at a time.
 *
 * Naming the file is cheaper than naming every dependency behind it, because the crawl follows it.
 * `deps.prebundled` is the other half, for a dependency no crawl reaches from anywhere.
 *
 * @param stated - The files, and why the crawl misses them.
 * @returns One contribution for each file.
 */
export function crawled(stated: Crawled): readonly Contribution[] {
  return stated.from.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `deps.crawled(${held})` }),
  );
}
