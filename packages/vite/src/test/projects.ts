/**
 * Running every package in a workspace from its root, each under its own configuration.
 */

import { globSync, readFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";

import { type Preset, preset } from "#core/layer.ts";

/**
 * Reads the workspace globs a manifest declares.
 *
 * @param at - The directory holding it.
 * @returns Each glob, however the manifest spells the field.
 * @throws Error Where the manifest declares no workspace, which means this is not a root.
 */
function membership(at: string): readonly string[] {
  const held: unknown = JSON.parse(readFileSync(join(at, "package.json"), "utf8"));
  const stated: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "workspaces") : undefined;
  const nested: unknown =
    typeof stated === "object" && stated !== null ? Reflect.get(stated, "packages") : undefined;
  const globs: unknown = Array.isArray(stated) ? stated : nested;

  if (!Array.isArray(globs) || globs.length === 0) {
    throw new Error(
      `test.projects(${at}) found no workspaces in its manifest. It belongs in the config at the ` +
        "root of a workspace, which is the only one that knows what the workspace holds.",
    );
  }

  return globs.filter((glob): glob is string => typeof glob === "string");
}

/**
 * Finds every package the workspace actually holds.
 *
 * The globs name where packages live; this names the ones that are there. A directory counts as a
 * package when it holds a manifest, which is also what tells a real package apart from a skeleton
 * directory left for one nobody has written yet.
 *
 * @param at - The directory holding the workspace manifest.
 * @returns Each package's directory, relative to the root.
 * @throws Error Where the globs match no package at all.
 */
function packages(at: string): readonly string[] {
  const found = globSync(
    membership(at).map((glob) => `${glob}/package.json`),
    { cwd: at },
  ).map((held) => dirname(held).replaceAll(sep, "/"));

  if (found.length === 0) {
    throw new Error(
      `test.projects(${at}) found no packages under what its manifest calls a workspace. Either ` +
        "the globs name somewhere nothing lives, or nothing has been written there yet.",
    );
  }

  return found.toSorted();
}

/**
 * Runs every package in the workspace, each under its own configuration.
 *
 * A workspace root has no tests of its own and every reason to run the ones below it. Left alone it
 * does the opposite: it finds every specification in every package and runs all of them under its
 * own settings, so a package that renders is tested without a document and reports that `document`
 * is not defined.
 *
 * The packages come from the manifest's own `workspaces`, which is already the list. A second copy
 * in this file would be a list to keep in step, and the failure when it drifted would be a package
 * silently not being tested.
 *
 * Each package is named by its directory rather than by its config file. Naming the config file
 * skips a package that has none — which is a legitimate thing to be, since a package with one entry
 * point needs no config and takes the root's — and skipping it means its specifications never run
 * and nothing says so. The manifest is what makes a directory a package, so that is what is looked
 * for; a skeleton directory holding neither is passed over, which is the case naming config files
 * was reaching for in the first place.
 *
 * The root stops looking for its own tests, because every one of them belongs to a package and
 * would otherwise run twice: once under the package's settings and once under the root's.
 *
 * @param at - The directory holding the workspace manifest, which is `import.meta.dirname`.
 * @returns The preset.
 * @throws Error Where the manifest declares no workspace, or the workspace holds no package.
 */
export function projects(at: string): Preset {
  return preset({
    config: { test: { include: [], projects: [...packages(at)] } },
    name: "test.projects",
  });
}
