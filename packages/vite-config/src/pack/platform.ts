/**
 * What a packed package is built to run on.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Where a packed package runs, which decides what the packer may leave to it.
 *
 * The packer builds for node unless told, and on node it reads the engine the manifest declares. A
 * package the browser runs has neither: no engines field describes a browser, and node's built-in
 * modules are not there to import.
 */
export type Platform = "browser" | "neutral" | "node";

/**
 * Builds the package for where it runs.
 *
 * @param on - The platform, as the packer names it.
 * @returns The preset.
 */
export function platform(on: Platform): Preset {
  return preset({ config: { pack: { platform: on } }, name: `pack.platform(${on})` });
}
