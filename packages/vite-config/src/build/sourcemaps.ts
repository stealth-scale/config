/**
 * Keeps a build debuggable without handing its source to whoever downloads it.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Generates a source map per chunk and omits the comment that would point a browser at it.
 *
 * @remarks
 *   No browser requests a map it is not told about, so a visitor opening the developer tools reads
 *   the built code. An error reporter given the map files separately still resolves a stack trace
 *   against them, which is the case this setting exists for.
 */
export function sourcemaps(): Preset {
  return preset({ config: { build: { sourcemap: "hidden" } }, name: "build.sourcemaps" });
}
