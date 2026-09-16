/**
 * Points the dependency scan at files it would not otherwise walk.
 *
 * @remarks
 *   Vite starts its scan from the HTML entries it knows about. A module reached
 *   some other way, such as a story or a preview harness, contributes nothing to
 *   that walk and neither do its imports.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

/**
 * Targets the entry list Vite's dependency scan walks before serving.
 */
const AT = "optimizeDeps.entries";

/**
 * Lists the files the scan should start from, and why it misses them.
 */
export interface Crawled {
  /**
   * Records what keeps these files out of the scan's own reach.
   */
  because: string;

  /**
   * Points at files by path or glob, resolved against the project root and kept as written.
   */
  files: readonly string[];
}

/**
 * Adds each file to the set the scan walks before a server starts serving.
 *
 * @remarks
 *   A dependency found only once the server is running forces a second optimise
 *   pass and a full page reload. Naming the file here moves that discovery into
 *   startup, where nobody is waiting on it.
 * @returns One contribution per entry, in the order they were given.
 */
export function crawl(stated: Crawled): readonly Contribution[] {
  return stated.files.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `deps.crawl(${held})` }),
  );
}
