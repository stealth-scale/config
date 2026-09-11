/**
 * What a build ships to make a browser fetch a chunk before it is asked for.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Stops shipping the module preload polyfill.
 *
 * A build emits `<link rel="modulepreload">` so a browser starts fetching a chunk while it is still
 * parsing the one that imports it, and ships a polyfill because Safari did not support the hint
 * until 17. The build target is the set of browsers that support everything in it, and every
 * browser in that set supports this, so the polyfill runs in nothing and costs every visitor the
 * bytes it takes to decide so.
 *
 * Nothing here applies to a library. The preload hints belong to a page, and a package that is
 * imported rather than opened emits none.
 *
 * @returns The preset.
 */
export function preload(): Preset {
  return preset({
    config: { build: { modulePreload: { polyfill: false } } },
    name: "build.preload",
  });
}
