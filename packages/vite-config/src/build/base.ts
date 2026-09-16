/**
 * Sets the public path a built application is served from.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Prefixes every generated asset reference with the path the deployment serves under.
 *
 * @remarks
 *   The prefix is written into each reference at build time, so a bundle built for one path cannot
 *   be moved to another without being rebuilt. A deployment that may move states `./` and accepts
 *   that a nested route then resolves relative to itself.
 * @param at - The path, or the full origin, the bundle is served from.
 */
export function base(at: string): Preset {
  return preset({ config: { base: at }, name: `build.base(${at})` });
}
