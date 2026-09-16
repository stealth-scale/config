/**
 * Fixes the runtime a packed library is resolved and built for.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Lists the runtimes the packer will resolve a dependency against.
 *
 * @remarks
 *   The two named runtimes each bring their own export conditions and their own set of built-in
 *   modules. `neutral` brings neither, which is what a library has to use when the same file has to
 *   load in both.
 */
export type Platform = "browser" | "neutral" | "node";

/**
 * Fixes the runtime, so a dependency resolves the same way here as it will at the consumer.
 *
 * @remarks
 *   Resolution happens while the library is packed, not when a consumer imports it. A library that
 *   has to run in more than one place therefore resolves against none of them.
 * @param on - The runtime to resolve against.
 */
export function platform(on: Platform): Preset {
  return preset({ config: { pack: { platform: on } }, name: `pack.platform(${on})` });
}
