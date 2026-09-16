/**
 * Keeps the export subpaths a manifest hand-wrote from being lost to a pack build.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Identifies the subpath a manifest publishes itself under, so carrying leaves it alone.
 */
const OWN = "./package.json";

/**
 * Carries what the packer hands a custom exports function.
 *
 * @remarks
 *   The packer passes the manifest exactly as it parsed it and narrows nothing, so a reader takes a
 *   field through `Reflect.get` rather than by property access.
 */
export interface Packed {
  /**
   * Exposes the manifest the packer parsed, before the packer rewrote a field of it.
   */
  pkg: object;
}

/**
 * Adds back each subpath the manifest points straight at a file, leaving the built ones alone.
 *
 * @remarks
 *   The packer replaces the whole export map with what it built, which drops a hand-written
 *   declaration file or a copied-in stylesheet. Only a subpath whose value is a string is carried,
 *   because an object value is a condition map the packer resolved and built itself.
 * @param built - The export map the packer produced from the entries it built.
 * @param context - The packing context, read for its manifest and nothing else.
 * @returns The built map with each carried subpath added, or the built map untouched when the
 *   manifest declares no export map.
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
 * Installs the exports function that carries a hand-written subpath into the published manifest.
 *
 * @remarks
 *   A package that also states subpaths of its own extends `pack.subpaths` instead, which composes
 *   this behaviour rather than replacing it. Extending both sets the same field twice.
 */
export function carry(): Preset {
  return preset({
    config: { pack: { exports: { customExports: carrying } } },
    name: "pack.carry",
  });
}
