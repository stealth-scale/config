/**
 * The types a package publishes beside its code.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Emits a declaration file for everything the package exports.
 *
 * The packer works this out from the tsconfig and the manifest and is usually right, which is not
 * the same as being asked. A package that stops shipping types because a field moved is a package
 * whose consumers lose every type at once, and nothing in its own checks would notice.
 *
 * @returns The preset.
 */
export function declarations(): Preset {
  return preset({ config: { pack: { dts: true } }, name: "pack.declarations" });
}
