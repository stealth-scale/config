/**
 * Lists the files a packer builds where the manifest does not decide them.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Builds exactly the files listed, whatever the manifest's export map says.
 *
 * @remarks
 *   The `pack.published` layer derives the same field from the manifest instead, and is the form a
 *   published package uses. This call suits a package that builds something its export map never
 *   names, such as a binary or a fixture.
 * @param files - Each entry, as a path relative to the package.
 */
export function entry(files: readonly string[]): Preset {
  return preset({
    config: { pack: { entry: [...files] } },
    name: `pack.entry(${files.join(", ")})`,
  });
}
