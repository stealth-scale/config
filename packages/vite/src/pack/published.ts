/**
 * Reading the entry points a package's own manifest says it publishes.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type Preset, preset } from "@stealthscale/config-core";

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
 * Reads the export map a manifest declares.
 *
 * @param at - The directory holding it.
 * @returns The map.
 * @throws Error Where the manifest declares no exports.
 */
function exported(at: string): object {
  const held: unknown = JSON.parse(readFileSync(join(at, "package.json"), "utf8"));
  const stated: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "exports") : undefined;

  if (typeof stated !== "object" || stated === null) {
    throw new Error(
      `pack.published(${at}) found no exports in its manifest. A package states what it publishes ` +
        "there, because that is the file the resolver reads, and the packer builds exactly that.",
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
 * Which directory to read is the one thing this cannot work out, which is why it is asked for.
 * Under the test runner the working directory is the workspace root while the config being read is
 * a package's, so only the config file knows, and it says so with `import.meta.dirname`.
 *
 * @param at - The directory holding the manifest, which is `import.meta.dirname`.
 * @returns The preset.
 * @throws Error Where the manifest declares no exports, or none the packer could build.
 */
export function published(at: string): Preset {
  const stated = exported(at);
  const entry: Record<string, string> = {};

  for (const subpath of Object.keys(stated)) {
    const value: unknown = Reflect.get(stated, subpath);
    const source: unknown =
      typeof value === "object" && value !== null ? Reflect.get(value, SOURCE) : undefined;

    if (typeof source === "string") {
      entry[subpath === "." ? ROOT : within(subpath)] = within(source);
    }
  }

  if (Object.keys(entry).length === 0) {
    throw new Error(
      `pack.published(${at}) found nothing to build. Every subpath the packer produces carries a ` +
        `\`${SOURCE}\` condition naming the file it is built from, and this manifest has none.`,
    );
  }

  return preset({
    config: { pack: { entry } },
    name: `pack.published(${Object.keys(entry).join(", ")})`,
  });
}
