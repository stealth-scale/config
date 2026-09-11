/**
 * How a packed package points at its own source.
 */

import { type Preset, preset } from "@stealthscale/config-core";

import { SOURCE } from "#resolve/condition.ts";

/**
 * Writes the export map twice: once for this workspace, once for whoever installs it.
 *
 * A package in a workspace is read as source, through the condition `resolve.source` puts on the
 * resolver. The same condition has to be in the export map for that to resolve, and has to be gone
 * from the published one — a consumer installing the package has no `src` directory, and an export
 * pointing into one is an export that fails.
 *
 * The packer writes both from this one answer, which is why the condition is named here rather than
 * copied into each package's config. The published one goes in `publishConfig`, which yarn and pnpm
 * apply when they pack and npm and bun do not — so a release is cut with one of the first two, and
 * a specification checks that what they would publish resolves to something shipped.
 *
 * Not optional, and not only a convenience. A layer is branded with a symbol, and a symbol from
 * this package's source is a different type from the same symbol in another package's `dist`. A
 * config mixing an import by relative path with one by name would have two `Layer` types that do
 * not agree, which is what the condition prevents by answering source for both.
 *
 * @returns The preset.
 */
export function source(): Preset {
  return preset({
    config: { pack: { exports: { devExports: SOURCE } } },
    name: `pack.source(${SOURCE})`,
  });
}
