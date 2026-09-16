/**
 * Ships the type declarations a consumer of a published package reads.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Emits a declaration file for every entry the packer builds.
 *
 * @remarks
 *   A package without declarations still resolves and still runs. Its consumer gets `any` for every
 *   import of it, and no type checker reports that as a fault.
 */
export function declarations(): Preset {
  return preset({ config: { pack: { dts: true } }, name: "pack.declarations" });
}
