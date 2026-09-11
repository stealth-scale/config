/**
 * Writing down which built file each source file became.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Writes the map from source paths to the hashed files they were built into.
 *
 * Every asset a build emits carries a content hash, which is what lets it be cached forever and
 * what makes its name unguessable. Anything outside the build that has to name one — a server
 * rendering the first response, a template injecting a stylesheet, a host loading another
 * application's entry — needs the map to do it, and without one the only options are parsing the
 * emitted HTML or pinning names and losing the cache.
 *
 * The cost is one small JSON file. That is cheap enough that writing it always is better than
 * discovering halfway through building something that reads it that the build was not writing it.
 *
 * @returns The preset.
 */
export function manifest(): Preset {
  return preset({ config: { build: { manifest: true } }, name: "build.manifest" });
}
