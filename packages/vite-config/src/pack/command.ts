/**
 * Declares the executables a package installs for whoever depends on it.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { type Commands } from "#pack/settings.ts";

/**
 * Publishes each named command, built from the source file stated against it.
 *
 * @remarks
 *   The layer carries the command names in its own name, so a repository can see from a resolved
 *   configuration which call put an executable there.
 * @param stated - Each command name, against the source file it is built from.
 */
export function command(stated: Commands): Preset {
  return preset({
    config: { pack: { exports: { bin: { ...stated } } } },
    name: `pack.command(${Object.keys(stated).join(", ")})`,
  });
}
