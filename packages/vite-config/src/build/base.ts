/**
 * Where a built application's own files are fetched from.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Serves an application's own files from a fixed place rather than from wherever it was loaded.
 *
 * A build writes relative URLs, which resolve against the page that loaded them. That is right for
 * an application that owns its page and wrong for one loaded into someone else's: the chunks
 * resolve against the host's origin, where they are not, and the application fails to load whatever
 * it had not already inlined.
 *
 * Naming the place is what makes the two independent. An application that states where its files
 * live can be mounted under any path of any host and still find them, which is the thing that has
 * to be true before one application can load another at run time.
 *
 * @param at - The URL the files are served from. Absolute for an application another one loads,
 *   because a relative one is resolved against whoever loaded it.
 * @returns The preset.
 */
export function base(at: string): Preset {
  return preset({ config: { base: at }, name: `build.base(${at})` });
}
