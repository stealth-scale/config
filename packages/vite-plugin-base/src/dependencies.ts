/**
 * Walks the packages a manifest depends on, the way Node resolves them.
 *
 * @remarks
 *   The walk reads `dependencies` alone. A peer is installed by whoever depends on the package,
 *   and a development dependency is the package's own business. A package is read once however
 *   many manifests name it, and one that is not installed is passed over, so a missing install
 *   never fails a build over a package nothing in it imports.
 */

import { createRequire } from "node:module";
import { dirname, join } from "node:path";

import { type Manifest, manifestAt, owning } from "#reached.ts";

/**
 * One package the walk reached, with what its manifest depends on.
 */
export interface Dependency {
  /**
   * The package's own directory, absolute.
   */
  at: string;

  /**
   * The names the package's manifest depends on, sorted.
   */
  dependsOn: readonly string[];

  /**
   * The package.json parsed out of that directory. Node resolved the package through that file,
   * so it parses; an empty record stands in where the file went between the two reads.
   */
  manifest: Manifest;

  /**
   * The name the package was depended on under.
   */
  named: string;
}

/**
 * Lists the names a manifest depends on at run time, sorted.
 */
function namesIn(manifest: Manifest | undefined): readonly string[] {
  const held = manifest?.["dependencies"];

  return typeof held === "object" && held !== null ? Object.keys(held).toSorted() : [];
}

/**
 * Resolves one request through a require function, and returns undefined where Node refuses it.
 */
function resolvedBy(require: NodeJS.Require, request: string): string | undefined {
  try {
    return require.resolve(request);
  } catch {
    return undefined;
  }
}

/**
 * Resolves the directory of a package from the directory of the package that depends on it.
 *
 * @remarks
 *   The manifest subpath is tried first. A package whose export map does not publish it is resolved
 *   by its entry and walked up from there. Both routes go through Node, so a package is found where
 *   the package manager put it for that dependent and nowhere else.
 * @returns The directory, or undefined where the package is not installed for that dependent.
 */
export function packageAt(name: string, from: string): string | undefined {
  const require = createRequire(join(from, "package.json"));
  const manifest = resolvedBy(require, `${name}/package.json`);

  if (manifest !== undefined) return dirname(manifest);

  const entry = resolvedBy(require, name);

  return entry === undefined ? undefined : owning(entry);
}

/**
 * Resolves the entry of a package from the root, or from any package on the root's dependency
 * graph, the way Node resolves it from each.
 *
 * @remarks
 *   A package that only a dependency declares is installed where that dependency resolves it,
 *   which under a package manager that does not flatten is not where the root resolves from.
 * @returns The entry file, absolute, or undefined where no package on the graph declares it.
 */
export function resolvedOnGraph(root: string, name: string): string | undefined {
  for (const at of [root, ...dependencies(root).map((one) => one.at)]) {
    const entry = resolvedBy(createRequire(join(at, "package.json")), name);

    if (entry !== undefined) return entry;
  }

  return undefined;
}

/**
 * Lists every package reachable through `dependencies` from the package at `root`, each once, with
 * a package placed after every package it depends on.
 *
 * @remarks
 *   The order is what a consumer needs when a later package's contribution has to win over an
 *   earlier one's. Two packages depending on each other are placed in the order they were met, so
 *   a cycle ends the descent rather than the walk. The root package itself is not listed.
 */
export function dependencies(root: string): readonly Dependency[] {
  const placed: Dependency[] = [];
  const done = new Set<string>();
  const placing = new Set<string>();

  /**
   * Places one package after everything it depends on, and passes over one that is not installed.
   */
  function place(name: string, from: string): void {
    if (done.has(name) || placing.has(name)) return;

    const at = packageAt(name, from);

    if (at === undefined) return;

    const manifest: Manifest = { ...manifestAt(at) };
    const dependsOn = namesIn(manifest);

    placing.add(name);

    for (const each of dependsOn) place(each, at);

    placing.delete(name);
    done.add(name);
    placed.push({ at, dependsOn, manifest, named: name });
  }

  for (const name of namesIn(manifestAt(root))) place(name, root);

  return placed;
}
