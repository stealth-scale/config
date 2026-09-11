/**
 * What a package publishes.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Publishes the files named, and everything they reach.
 *
 * What a package's entry points are is the package's own knowledge and nothing else's: it is the
 * shape of what it offers, decided by whoever wrote it. The packer guesses `src/index.ts` where
 * nothing says otherwise, which is right often enough to be worth stating when it is not.
 *
 * @param files - The entry points, relative to the package.
 * @returns The preset.
 */
export function entry(files: readonly string[]): Preset {
  return preset({
    config: { pack: { entry: [...files] } },
    name: `pack.entry(${files.join(", ")})`,
  });
}
