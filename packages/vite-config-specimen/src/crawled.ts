/**
 * Adds the specimens to the entries the dependency scan walks before a server starts serving.
 */

import { deps } from "@stealthscale/vite-config";
import { type Contribution, named } from "@stealthscale/vite-config-core";

/**
 * Renames one crawl entry so its layer name identifies this package.
 *
 * @remarks
 *   A layer is named for the call a consumer wrote, and a consumer writes `crawled` rather than
 *   `deps.crawl`.
 */
function renamed(contribution: Contribution): Contribution {
  return named(contribution.name.replace("deps.crawl", "specimen.crawled"), contribution);
}

/**
 * Appends every specimen, and the application's own HTML, to the dependency scan's entries.
 *
 * @remarks
 *   A specimen is reached from the index through a dynamic import of a file outside the project
 *   root, and the scan follows neither. Left out, the first page a reader opens discovers its
 *   dependencies, re-optimises, and reloads the whole catalogue. Naming the entries disables Vite's
 *   own inference, which is why the HTML is named again beside them.
 * @param patterns - Where the specimens are, as the plugin's options state them.
 */
export function crawled(patterns: readonly string[]): readonly Contribution[] {
  return deps
    .crawl({
      because:
        "a specimen is reached through a dynamic import the dependency scan does not follow, so " +
        "its dependencies would be discovered by the first page opened and cost a reload",
      files: ["**/*.html", ...patterns],
    })
    .map((contribution) => renamed(contribution));
}
