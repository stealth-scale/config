/**
 * Checks the package.json of a package against what the house publishes.
 *
 * @remarks
 *   Every check here reads the manifest on disk rather than the module graph, so it reports what
 *   npm would pack rather than what the specification happened to import. Reading a manifest
 *   throws where the file is absent or is not JSON, and the engines check inherits that from the
 *   workspace root it reads.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Selects which of the three contracts a package is held to.
 *
 * @remarks
 *   The kind decides which checks run. A library is checked on its manifest alone, a plugin on
 *   its factory as well, and a config package on its barrel, its README and its tiers.
 */
export type Kind = "config" | "library" | "plugin";

/**
 * Describes an export target: a single path, or a map of conditions to paths.
 *
 * @remarks
 *   The house publishes the conditional form for anything with a source entry, and
 *   `publishConfig` rewrites it to the string form for a consumer.
 */
export type Target = Readonly<Record<string, string>> | string;

/**
 * Describes the manifest fields these checks read.
 *
 * @remarks
 *   Only the name is required, because a field a manifest omits is what a check reports. Nothing
 *   validates the parsed JSON, so a field written with the wrong type arrives at a check as it
 *   stands.
 */
export interface Published {
  /**
   * The dependencies the package installs for itself, read to catch a peer listed twice.
   */
  readonly dependencies?: Readonly<Record<string, string>> | undefined;

  /**
   * The runtimes the package declares.
   */
  readonly engines?: Engines | undefined;

  /**
   * The subpaths as a consumer inside the workspace resolves them.
   */
  readonly exports?: Readonly<Record<string, Target>> | undefined;

  /**
   * The entries npm packs, the licence and the README included.
   */
  readonly files?: readonly string[] | undefined;

  /**
   * The published name, scope and all.
   */
  readonly name: string;

  /**
   * The dependencies a consumer is asked to supply.
   */
  readonly peerDependencies?: Readonly<Record<string, string>> | undefined;

  /**
   * The overrides npm applies while packing.
   */
  readonly publishConfig?: PublishConfig | undefined;
}

/**
 * The engines field of a manifest, as these checks read it.
 *
 * @remarks
 *   Only node is read. A range declared against any other engine is left where it is.
 */
export interface Engines {
  /**
   * The node range, compared against the workspace root's.
   */
  readonly node?: string | undefined;
}

/**
 * Covers the export map npm swaps in while packing.
 *
 * @remarks
 *   Every subpath in it resolves to the build output, and the source condition a workspace
 *   consumer compiles against is dropped.
 */
export interface PublishConfig {
  /**
   * The subpaths a consumer of the published package resolves.
   */
  readonly exports?: Readonly<Record<string, Target>> | undefined;
}

/**
 * The one subpath every export check passes over.
 *
 * @remarks
 *   A manifest exports itself under this subpath, and it has neither a source file nor a built
 *   default for a check to look for.
 */
const MANIFEST = "./package.json";

/**
 * The export condition resolving to source inside the workspace.
 */
const SOURCE = "stealth-source";

/**
 * Lists the files a published package ships beside its build output.
 */
const CARRIED = ["LICENSE", "README.md"];

/**
 * Reads and parses the package.json sitting in a directory.
 *
 * @remarks
 *   The parsed value is asserted to the shape these checks read and nothing validates it, so a
 *   field of the wrong type is reported by the check that reads it rather than here.
 * @throws {@link Error} When the file is absent, unreadable, or not JSON.
 */
export function publishedOf(at: string): Published {
  const text = readFileSync(join(at, "package.json"), "utf8");

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the checks here assert the shape
  return JSON.parse(text) as Published;
}

/**
 * Finds the workspace root above a directory by the pnpm-workspace.yaml marking it.
 *
 * @remarks
 *   The walk stops at the filesystem root and yields undefined, so a package checked outside a
 *   workspace has nothing to compare itself against instead of failing.
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
 * Lists the entries of an export map, less the manifest's own subpath.
 *
 * @remarks
 *   A map that is undefined yields nothing, so a manifest exporting nothing at all passes through
 *   here rather than failing.
 */
function subpaths(
  exportMap: Readonly<Record<string, Target>> | undefined,
): Array<[string, Target]> {
  return Object.entries(exportMap ?? {}).filter(([subpath]) => subpath !== MANIFEST);
}

/**
 * Reports a plain target naming a file that is not on disk.
 */
function file(subpath: string, target: string, at: string): readonly string[] {
  return existsSync(join(at, target))
    ? []
    : [`exports["${subpath}"] names ${target}, which does not exist`];
}

/**
 * Reports a conditional target whose default is not built, or whose source entry is not source.
 *
 * @remarks
 *   The default belongs under dist because that is what npm packs, and the source entry belongs
 *   under src and has to exist, because that is what a workspace consumer compiles. Both are
 *   reported together rather than stopping at the first one.
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
 * Reports the subpaths on which the workspace map and the published map disagree.
 *
 * @remarks
 *   Both directions are reported, so a subpath published without being declared is caught along
 *   with one declared and never published.
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
 * Checks that every exported subpath resolves and that packing republishes it unchanged.
 *
 * @remarks
 *   A conditional subpath with no `publishConfig` behind it is published as written, which ships
 *   a source condition to a consumer who has no compiler. That one is reported against the
 *   manifest rather than against each subpath.
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
 * Lists the built files a consumer of the published package can reach, each one once.
 *
 * @remarks
 *   A conditional target with no default contributes nothing, because the export check has
 *   already reported it. The published map wins over the workspace map wherever both exist.
 */
function shipped(published: Published): readonly string[] {
  const targets = subpaths(published.publishConfig?.exports ?? published.exports).flatMap(
    ([, target]) => (typeof target === "string" ? [target] : [target["default"] ?? ""]),
  );

  return [...new Set(targets.filter((target) => target !== ""))];
}

/**
 * Checks that the files list carries the licence and README, exists on disk, and covers the
 * exports.
 *
 * @remarks
 *   The `dist` entry is exempt from the existence check, because a manifest is checked before
 *   anything has been built. Every other entry has to be there when the check runs.
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
 * Compares the node range a package declares against the workspace root's.
 *
 * @remarks
 *   A package checked outside a workspace states its range and is compared against nothing.
 *   Declaring no range at all is a violation either way.
 * @throws {@link Error} When a workspace root is found and its manifest cannot be read.
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
 * Checks the peers a package declares for a double entry, a loose range, and the toolchain.
 *
 * @remarks
 *   A package peering on vite-plus asks a consumer for the toolchain, where Vite itself is what
 *   the package configures. A config package peering on nothing named vite configures a tool the
 *   consumer was never asked to install.
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
