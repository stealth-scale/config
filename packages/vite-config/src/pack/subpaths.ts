/**
 * Publishes a subpath that neither the manifest names nor the packer builds.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { carrying, type Packed } from "#pack/carry.ts";

/**
 * Adds each stated subpath to the export map, over whatever else put one there.
 *
 * @remarks
 *   The stated map is applied after {@link carrying}, so a package extending this keeps its
 *   hand-written subpaths and still wins for any subpath both name. A package that extends
 *   `pack.carry` as well states the same setting twice, and only one of the two survives.
 * @param exports - Each subpath a consumer may import, against the built file behind it.
 */
export function subpaths(exports: Readonly<Record<string, string>>): Preset {
  return preset({
    config: {
      pack: {
        exports: {
          customExports: (built: Record<string, unknown>, context: Packed) => ({
            ...carrying(built, context),
            ...exports,
          }),
        },
      },
    },
    name: `pack.subpaths(${Object.keys(exports).join(", ")})`,
  });
}
