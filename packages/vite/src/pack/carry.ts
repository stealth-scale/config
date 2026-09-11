/**
 * Keeping the subpaths a package ships without building them.
 */

import { type Preset, preset } from "@stealthscale/config-core";

/**
 * The subpath the packer writes on its own, and would write twice if it were handed back.
 */
const OWN = "./package.json";

/**
 * The part of the packer's context this reads.
 */
export interface Packed {
  /**
   * The manifest as it stands on disk, before the packer writes its own answer over it.
   */
  pkg: object;
}

/**
 * Puts every shipped subpath the manifest names back into the map the packer just wrote.
 *
 * A subpath resolving to a plain string names a file that ships as it stands, and is handed
 * straight back. One resolving through a condition is something the packer built, and it has just
 * written a better answer than the manifest's own.
 *
 * @param built - The map the packer wrote from what it built.
 * @param context - The manifest to read the shipped subpaths back out of.
 * @returns The map to write instead.
 */
export function carrying(built: Record<string, unknown>, context: Packed): Record<string, unknown> {
  const stated: unknown = Reflect.get(context.pkg, "exports");

  if (typeof stated !== "object" || stated === null) return built;

  const held = { ...built };

  for (const subpath of Object.keys(stated)) {
    const value: unknown = Reflect.get(stated, subpath);

    if (subpath !== OWN && typeof value === "string") held[subpath] = value;
  }

  return held;
}

/**
 * Puts back every subpath the manifest points straight at a shipped file.
 *
 * The packer rebuilds the export map out of what it just built, so a subpath naming a file it did
 * not build is gone by the time the map is written: a declaration written by hand, a setup file a
 * consumer loads, a manifest of data. Nothing reports it. The package publishes, the checks pass,
 * and the subpath fails for whoever installs it.
 *
 * The manifest is where those subpaths are already written, so there is nothing for a config to
 * state, and this runs for every package rather than for the ones that remembered to ask.
 *
 * @returns The preset.
 */
export function carry(): Preset {
  return preset({
    config: { pack: { exports: { customExports: carrying } } },
    name: "pack.carry",
  });
}
