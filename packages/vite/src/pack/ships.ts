/**
 * Publishing subpaths a package works out rather than writes down.
 */

import { type Preset, preset } from "#core/layer.ts";
import { carrying, type Packed } from "#pack/carry.ts";

/**
 * Publishes subpaths another module worked out.
 *
 * `pack.carry` already keeps whatever the manifest names, and a file a person wrote belongs there:
 * it is the map the resolver reads, so writing it down is what makes the subpath resolve before
 * anything is packed. This is for the other case — a map that is computed, where writing it down
 * would be copying one package's list into every package that ships that list, and the failure when
 * the two drift is a subpath pointing at a file the generator stopped writing.
 *
 * Whatever the manifest names is carried through as well, so a package using this keeps the
 * subpaths it wrote by hand and states neither list twice.
 *
 * @param exports - Each subpath against the file it names.
 * @returns The preset.
 */
export function ships(exports: Readonly<Record<string, string>>): Preset {
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
    name: `pack.ships(${Object.keys(exports).join(", ")})`,
  });
}
