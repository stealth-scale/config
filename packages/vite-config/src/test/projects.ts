/**
 * Handing the runner every package in a workspace as a project of its own.
 */

import { globSync } from "node:fs";
import { dirname, sep } from "node:path";

import { type Manifest, type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Takes the workspace globs off a manifest.
 *
 * @remarks
 *   Only the root of a workspace knows what the workspace holds. A manifest
 *   without globs belongs to a package rather than a root, and the message says
 *   where the layer should have gone instead.
 * @throws {@link Error} When the manifest declares no workspace.
 */
function membership(manifest: Manifest, at: string): readonly string[] {
  const globs = manifest.workspaces ?? [];

  if (globs.length === 0) {
    throw new Error(
      `test.projects() found no workspaces in the manifest at ${at}. It belongs in the config at ` +
        "the root of a workspace, which is the only one that knows what the workspace holds.",
    );
  }

  return globs;
}

/**
 * Expands the workspace globs to the directories that hold a manifest.
 *
 * @remarks
 *   A directory with no manifest in it is not a package, so a skeleton left
 *   behind by a plan is walked past rather than handed to the runner. The
 *   result is sorted, because a file system lists a directory however it stored
 *   it.
 * @returns Each package directory, relative to the root and separated by
 *   forward slashes on every platform.
 * @throws {@link Error} When the globs match no package.
 */
function packages(manifest: Manifest, at: string): readonly string[] {
  const found = globSync(
    membership(manifest, at).map((glob) => `${glob}/package.json`),
    { cwd: at },
  ).map((held) => dirname(held).replaceAll(sep, "/"));

  if (found.length === 0) {
    throw new Error(
      `test.projects() found no packages under what the manifest at ${at} calls a workspace. ` +
        "Either the globs name somewhere nothing lives, or nothing has been written there yet.",
    );
  }

  return found.toSorted();
}

/**
 * Runs each package in the workspace as a project, and none at the root.
 *
 * @remarks
 *   Away from the root the layer states nothing, so a package extending a
 *   configuration that holds it carries on collecting its own tests. The root
 *   collects none of its own, because everything it would find belongs to a
 *   project.
 * @throws {@link Error} When the configuration resolves at a root whose
 *   manifest declares no workspace, or whose globs match nothing.
 */
export function projects(): Preset {
  return preset({
    config: (context) =>
      context.at === context.root
        ? { test: { include: [], projects: [...packages(context.manifest, context.at)] } }
        : {},
    name: "test.projects",
  });
}
