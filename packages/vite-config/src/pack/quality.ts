/**
 * Checks a published package the way a consumer's own toolchain will read it.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Matches the entry points that ship no types and are not meant to.
 *
 * @remarks
 *   A stylesheet entry has no declaration behind it. The type check reads a missing declaration as
 *   a broken entry point, so each such entry has to be named here or the check fails on a package
 *   that is correct.
 */
const UNTYPED = [/\.css$/u];

/**
 * Reads the packed output back, both as a package manager sees it and as a type checker does.
 *
 * @remarks
 *   Both checks run against what the packer wrote rather than what the repository stated, so they
 *   catch an export map the build got wrong as well as one a package declared wrong.
 */
export function quality(): Preset {
  return preset({
    config: { pack: { attw: { excludeEntrypoints: UNTYPED }, publint: true } },
    name: "pack.quality",
  });
}
