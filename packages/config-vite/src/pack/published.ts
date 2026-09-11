/**
 * Reading the entry points a package's own manifest says it publishes.
 */

import { type Context, type Preset, preset } from "@stealthscale/config-core";

import { SOURCE } from "#resolve/condition.ts";

/**
 * What the packer builds the root subpath under.
 */
const ROOT = "index";

/**
 * Strips the leading marker a manifest puts on every path it names.
 *
 * @param path - The path as the manifest spells it.
 * @returns The path relative to the package.
 */
function within(path: string): string {
  return path.startsWith("./") ? path.slice(2) : path;
}

/**
 * Reads the export map of the package being configured.
 *
 * @param context - The command, the mode and the repository around them.
 * @returns The map.
 * @throws Error Where a workspace root is being packed, or the manifest declares no exports.
 */
function exported(context: Context): Readonly<Record<string, unknown>> {
  if (context.at === context.root) {
    throw new Error(
      "pack.published() is reading the workspace root's manifest, which publishes nothing. A " +
        "package states this in its own config, and a package with no config of its own takes " +
        "the root's — so it names its entry on the command line instead.",
    );
  }

  const stated = context.manifest.exports;

  if (stated === undefined) {
    throw new Error(
      `pack.published() found no exports in the manifest at ${context.at}. A package states what ` +
        "it publishes there, because that is the file the resolver reads, and the packer builds " +
        "exactly that.",
    );
  }

  return stated;
}

/**
 * Builds whatever the package's own manifest says it publishes.
 *
 * The export map is the package's public surface, and it is already written down: the resolver
 * reads it, `publint` checks it, and a consumer's import fails against it. Stating the same surface
 * again in a config is a second place for it to be wrong, and the way it goes wrong is a subpath
 * that resolves for whoever wrote it and for nobody else.
 *
 * The packer will not read it. Its entry is a config field, and given none it builds `src/index.ts`
 * alone — so a package that had grown three subpaths would publish one and report success. This
 * reads the map instead and hands the packer what it found, keyed by the subpath each was found
 * under, so where a source file sits decides nothing about what a consumer imports.
 *
 * That the packer then rewrites the map from those entries is what makes the pair hold: it lands on
 * what it was given. A subpath is added by writing it into the manifest, beside the ones already
 * there, in the file a consumer will read it from.
 *
 * @returns The preset.
 * @throws Error Where the manifest declares no exports, or none the packer could build.
 */
export function published(): Preset {
  return preset({
    config: (context) => {
      const stated = exported(context);
      const entry: Record<string, string> = {};

      for (const [subpath, value] of Object.entries(stated)) {
        const source: unknown =
          typeof value === "object" && value !== null ? Reflect.get(value, SOURCE) : undefined;

        if (typeof source === "string") {
          entry[subpath === "." ? ROOT : within(subpath)] = within(source);
        }
      }

      if (Object.keys(entry).length === 0) {
        throw new Error(
          `pack.published() found nothing to build in the manifest at ${context.at}. Every ` +
            `subpath the packer produces carries a \`${SOURCE}\` condition naming the file it is ` +
            "built from, and this manifest has none.",
        );
      }

      return { pack: { entry } };
    },
    name: "pack.published",
  });
}
