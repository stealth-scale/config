/**
 * Reads a package manifest and reports every promise in it that the tree does not keep.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * The kind of package under test.
 *
 * A config package is checked on its manifest, its barrel, its README table, its layers and its
 * tiers. A plugin package is checked on its manifest and its plugin factory. A library is checked
 * on its manifest alone.
 */
export type Kind = "config" | "library" | "plugin";

/**
 * The target of one subpath in an export map: a file, or a map from condition to file.
 */
export type Target = Readonly<Record<string, string>> | string;

/**
 * The manifest fields the checks read.
 */
export interface Published {
  /**
   * The packages installed for the package itself.
   */
  readonly dependencies?: Readonly<Record<string, string>> | undefined;

  /**
   * The runtimes the package runs under.
   */
  readonly engines?: Engines | undefined;

  /**
   * The subpaths the package exports, each with its target.
   */
  readonly exports?: Readonly<Record<string, Target>> | undefined;

  /**
   * The files that go in the tarball.
   */
  readonly files?: readonly string[] | undefined;

  /**
   * The package name.
   */
  readonly name: string;

  /**
   * The packages a consumer has to install beside this one.
   */
  readonly peerDependencies?: Readonly<Record<string, string>> | undefined;

  /**
   * The fields that replace their namesakes when the package is published.
   */
  readonly publishConfig?: PublishConfig | undefined;
}

/**
 * The runtimes a package runs under.
 */
export interface Engines {
  /**
   * The node version range.
   */
  readonly node?: string | undefined;
}

/**
 * The fields that replace their namesakes when the package is published.
 */
export interface PublishConfig {
  /**
   * The subpaths as they appear in the tarball, each with its target.
   */
  readonly exports?: Readonly<Record<string, Target>> | undefined;
}

/**
 * The subpath every package exports for its own manifest. No check reads it.
 */
const MANIFEST = "./package.json";

/**
 * The condition a stealth package publishes its source under.
 */
const SOURCE = "stealth-source";

/**
 * The files every tarball carries beside its build output.
 */
const CARRIED = ["LICENSE", "README.md"];

/**
 * Reads the manifest of the package at a directory.
 *
 * The file is read from disk rather than imported, because the catalog protocol is visible in the
 * file and resolved away in the installed copy.
 *
 * @param at - The package directory, as an absolute path.
 * @returns The parsed manifest.
 */
export function publishedOf(at: string): Published {
  const text = readFileSync(join(at, "package.json"), "utf8");

  // The manifest is read from disk, and its shape is what the checks in this module assert on
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return JSON.parse(text) as Published;
}

/**
 * Finds the manifest of the pnpm workspace that contains a package.
 *
 * @param at - The package directory.
 * @returns The root manifest, or `undefined` when no ancestor directory holds a
 *   `pnpm-workspace.yaml`.
 */
function rootOf(at: string): Published | undefined {
  for (let directory = at, parent = dirname(at); parent !== directory;) {
    if (existsSync(join(directory, "pnpm-workspace.yaml"))) return publishedOf(directory);

    directory = parent;
    parent = dirname(directory);
  }

  return undefined;
}

/**
 * Lists the subpaths of an export map, leaving out the manifest's own.
 *
 * @param exportMap - The `exports` field or the `publishConfig.exports` field.
 * @returns Each subpath with its target, in the order the map declares them.
 */
function subpaths(
  exportMap: Readonly<Record<string, Target>> | undefined,
): Array<[string, Target]> {
  return Object.entries(exportMap ?? {}).filter(([subpath]) => subpath !== MANIFEST);
}

/**
 * Checks a subpath that resolves to one file.
 *
 * @param subpath - The subpath to check.
 * @param target - The file the subpath resolves to.
 * @param at - The package directory.
 * @returns One violation when the file does not exist, otherwise an empty array.
 */
function file(subpath: string, target: string, at: string): readonly string[] {
  return existsSync(join(at, target))
    ? []
    : [`exports["${subpath}"] names ${target}, which does not exist`];
}

/**
 * Checks a subpath that resolves to a different file per condition.
 *
 * The `default` condition has to point into `dist`, and the stealth condition has to point at an
 * existing file under `src`.
 *
 * @param subpath - The subpath to check.
 * @param target - The map from condition to file.
 * @param at - The package directory.
 * @returns Each violation.
 */
function conditional(
  subpath: string,
  target: Readonly<Record<string, string>>,
  at: string,
): readonly string[] {
  const violations: string[] = [];
  const built = target["default"];
  const source = target[SOURCE];

  if (built === undefined) violations.push(`exports["${subpath}"] has no default`);
  else if (!built.startsWith("./dist/")) {
    violations.push(`exports["${subpath}"] defaults to ${built}, which is not under dist`);
  }

  if (source === undefined) violations.push(`exports["${subpath}"] publishes no ${SOURCE}`);
  else if (!source.startsWith("./src/") || !existsSync(join(at, source))) {
    violations.push(
      `exports["${subpath}"] names ${source} under ${SOURCE}, which is not a source file`,
    );
  }

  return violations;
}

/**
 * Checks that the published export map names the same subpaths as the development export map,
 * and that each one resolves to the built file.
 *
 * @param developed - The `exports` field.
 * @param packed - The `publishConfig.exports` field.
 * @returns Each violation.
 */
function agreeing(
  developed: Readonly<Record<string, Target>>,
  packed: Readonly<Record<string, Target>>,
): readonly string[] {
  const violations: string[] = [];

  for (const [subpath, target] of subpaths(developed)) {
    const released = packed[subpath];
    const built = typeof target === "string" ? target : target["default"];

    if (released === undefined) violations.push(`publishConfig.exports omits ${subpath}`);
    else if (released !== built) {
      violations.push(
        `publishConfig.exports["${subpath}"] is ${JSON.stringify(released)}, not ${JSON.stringify(built)}`,
      );
    }
  }

  for (const [subpath] of subpaths(packed)) {
    if (developed[subpath] === undefined) {
      violations.push(`exports omits ${subpath}, which is published`);
    }
  }

  return violations;
}

/**
 * Checks the export map of a manifest.
 *
 * Every conditional subpath has to publish its source under the stealth condition and default to
 * a built file. A manifest with a conditional subpath also has to carry `publishConfig.exports`,
 * and the two maps have to agree.
 *
 * @param published - The manifest to check.
 * @param at - The package directory.
 * @returns Each violation.
 */
export function exports(published: Published, at: string): readonly string[] {
  const developed = subpaths(published.exports);
  const violations = developed.flatMap(([subpath, target]) =>
    typeof target === "string" ? file(subpath, target, at) : conditional(subpath, target, at),
  );
  const packed = published.publishConfig?.exports;

  if (packed !== undefined) {
    return [...violations, ...agreeing(published.exports ?? {}, packed)];
  }

  return developed.some(([, target]) => typeof target !== "string")
    ? [
        ...violations,
        "publishConfig.exports is missing, and a conditional subpath is published as written",
      ]
    : violations;
}

/**
 * Lists the files the published subpaths resolve to.
 *
 * @param published - The manifest to read.
 * @returns Each file the tarball has to carry, once.
 */
function shipped(published: Published): readonly string[] {
  const targets = subpaths(published.publishConfig?.exports ?? published.exports).flatMap(
    ([, target]) => (typeof target === "string" ? [target] : [target["default"] ?? ""]),
  );

  return [...new Set(targets.filter((target) => target !== ""))];
}

/**
 * Checks the `files` field of a manifest.
 *
 * The field has to list the licence and the README, every entry in it has to exist, and every
 * published subpath has to resolve into one of its entries. `dist` is exempt from the existence
 * check, because a package is checked before it is built as often as after.
 *
 * @param published - The manifest to check.
 * @param at - The package directory.
 * @returns Each violation.
 */
export function files(published: Published, at: string): readonly string[] {
  const listed = published.files ?? [];
  const missing = CARRIED.filter((name) => !listed.includes(name)).map(
    (name) => `files omits ${name}`,
  );
  const absent = listed
    .filter((name) => name !== "dist" && !existsSync(join(at, name)))
    .map((name) => `files lists ${name}, which does not exist`);
  const uncovered = shipped(published)
    .filter(
      (target) => !listed.some((name) => target === `./${name}` || target.startsWith(`./${name}/`)),
    )
    .map((target) => `files does not cover ${target}`);

  return [...missing, ...absent, ...uncovered];
}

/**
 * Checks that the node version range matches the one at the workspace root.
 *
 * A package outside a workspace has no root to match, and only its own range is checked.
 *
 * @param published - The manifest to check.
 * @param at - The package directory.
 * @returns Each violation.
 */
export function engines(published: Published, at: string): readonly string[] {
  const own = published.engines?.node;

  if (own === undefined) return ["engines.node is not stated"];

  const root = rootOf(at)?.engines?.node;

  return root === undefined || root === own
    ? []
    : [`engines.node is ${own}, and the workspace root states ${root}`];
}

/**
 * Checks the peer dependencies of a manifest.
 *
 * A package peers on `vite` and never on the toolchain built over it, so the toolchain can be
 * replaced without a change to any package. A config package composes a Vite config and has to
 * peer on `vite`. A peer on `vite` or `vitest` has to come from the peer catalog, so the published
 * range is a real range and not the exact version the workspace pins.
 *
 * @param published - The manifest to check.
 * @param kind - The kind of package. Only a config package is required to peer on `vite`.
 * @returns Each violation.
 */
export function peers(published: Published, kind: Kind): readonly string[] {
  const peered = published.peerDependencies ?? {};
  const installed = Object.keys(published.dependencies ?? {});
  const doubled = Object.keys(peered)
    .filter((name) => installed.includes(name))
    .map((name) => `${name} is both a peer and a dependency`);
  const uncatalogued = ["vite", "vitest"]
    .filter((name) => peered[name] !== undefined && peered[name] !== "catalog:peer")
    .map((name) => `${name} is peered as ${String(peered[name])}, not from the peer catalog`);
  const toolchain =
    peered["vite-plus"] === undefined
      ? []
      : ["the package peers on vite-plus, where vite is what it configures"];
  const missing =
    kind === "config" && peered["vite"] === undefined
      ? ["a config package peers on nothing named vite"]
      : [];

  return [...doubled, ...uncatalogued, ...toolchain, ...missing];
}
