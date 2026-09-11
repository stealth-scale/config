/**
 * The commands a package installs.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { type Commands } from "#pack/settings.ts";

/**
 * Installs a command under the name it is run by.
 *
 * The packer works this out on its own by looking for a shebang, and names whatever it finds after
 * the package with its scope stripped. That is right until the two differ — a package named for
 * where it sits in a tree, installing a command named for what it does — and then the command is
 * published under a name nobody types and nothing reports it.
 *
 * Named source files rather than built ones. Under the source condition the `bin` field points at
 * source while the repository is being worked on and `publishConfig.bin` points at the build, which
 * is the same split the export map already gets.
 *
 * @param stated - Each command name against the file behind it, relative to the package.
 * @returns The preset.
 */
export function command(stated: Commands): Preset {
  return preset({
    config: { pack: { exports: { bin: { ...stated } } } },
    name: `pack.command(${Object.keys(stated).join(", ")})`,
  });
}
