/**
 * Which packages a build actually reached, read from the graph rather than from a manifest.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";

import { type Bundling } from "#plugin.ts";

/**
 * What a package's manifest holds.
 *
 * Every field is untyped. A manifest is whatever somebody wrote, and a plugin reading one wants
 * fields no interface here could usefully enumerate, such as `license`, `homepage`, `bugs` and
 * `author`. Read a field through `text`, which checks the type.
 */
export type Manifest = Readonly<Record<string, unknown>>;

/**
 * Reads one text field out of a manifest.
 *
 * @param manifest - The manifest to read.
 * @param field - Which field.
 * @returns Its value, or nothing when the field is absent or is not text.
 */
export function text(manifest: Manifest, field: string): string | undefined {
  const held = manifest[field];

  return typeof held === "string" ? held : undefined;
}

/**
 * A package a build reached, and where it was read from.
 */
export interface Reached {
  /**
   * Where the package's own directory is, as an absolute path.
   */
  at: string;

  /**
   * The directories of the packages this one imported, each once.
   *
   * Read from what its modules imported rather than from its manifest. A manifest names what was
   * asked for, including what the bundler dropped. This names what the package actually reached in
   * the build being described.
   */
  dependsOn: ReadonlySet<string>;

  /**
   * What its manifest holds.
   */
  manifest: Manifest;

  /**
   * The package's name, which its manifest had to declare.
   */
  named: string;
}

/**
 * Finds the directory of the package a file belongs to.
 *
 * It walks up from the file to the nearest manifest, which is what a resolver does, so the result
 * agrees with the one the bundler used. Reading the path instead would have to know every layout a
 * package manager writes. Bun nests a second `node_modules` inside `.bun`, pnpm writes a store and
 * npm hoists, and a reader would be wrong on whichever layout it had not been told about.
 *
 * @param from - A file the build reached.
 * @returns The package's directory, or nothing when the walk reaches the file system root.
 */
export function owning(from: string): string | undefined {
  for (let at = dirname(from); ;) {
    if (existsSync(join(at, "package.json"))) return at;

    const up = dirname(at);

    if (up === at) return undefined;

    at = up;
  }
}

/**
 * Reads the manifest in a directory.
 *
 * @param at - The package's directory.
 * @returns Its fields, or nothing when there is no manifest or it does not parse.
 */
export function manifestAt(at: string): Manifest | undefined {
  try {
    const held: unknown = JSON.parse(readFileSync(join(at, "package.json"), "utf8"));

    if (typeof held !== "object" || held === null) return undefined;

    return Object.fromEntries(Object.entries(held));
  } catch {
    return undefined;
  }
}

/**
 * Reports whether a module came from a package rather than from the repository being built.
 *
 * @param id - The module's resolved identifier.
 * @returns Whether it was installed.
 */
function installed(id: string): boolean {
  return id.split(sep).includes("node_modules");
}

/**
 * The names a licence is conventionally filed under.
 *
 * Both spellings, and `COPYING`, which is what a project following the GNU conventions writes. The
 * extension varies and is matched rather than listed.
 */
const LICENCES = /^(?:licen[cs]e|copying)(?:\..*)?$/iu;

/**
 * A licence file found beside a package.
 */
export interface Licensed {
  /**
   * The file's own name, so a reader can see which of the conventions was used.
   */
  named: string;

  /**
   * Its full text.
   */
  text: string;
}

/**
 * Reads the licence files a package ships.
 *
 * The text rather than the manifest's `license` field, which is an SPDX identifier somebody typed.
 * The file beside it is the evidence, and the two disagree often enough that a licence review
 * cannot rely on the field alone.
 *
 * Only the package's own directory is read, not below it. A licence deeper in the tree belongs to
 * something the package vendored, which is that thing's evidence rather than this one's.
 *
 * @param at - The package's directory.
 * @returns Each licence file, or none when the package ships no text.
 */
export function licensed(at: string): readonly Licensed[] {
  try {
    return readdirSync(at, { withFileTypes: true })
      .filter((held) => held.isFile() && LICENCES.test(held.name))
      .map((held) => ({ named: held.name, text: readFileSync(join(at, held.name), "utf8") }));
  } catch {
    return [];
  }
}

/**
 * A package being gathered, before the map is returned.
 */
interface Made {
  /**
   * Where the package's own directory is.
   */
  at: string;

  /**
   * What it imported, filled in as the graph is walked.
   */
  dependsOn: Set<string>;

  /**
   * What its manifest holds.
   */
  manifest: Manifest;

  /**
   * The package's name, which its manifest had to declare.
   */
  named: string;
}

/**
 * Every installed package the build reached, each once.
 *
 * Read from the graph rather than from the manifest. A bundler inlines what it reached, including
 * what it reached through something else, while a manifest names direct dependencies only. An
 * inventory built from a manifest therefore describes what was asked for rather than what is in the
 * artefact: `scheduler` arrives through React and appears in no application's manifest.
 *
 * A module with no manifest above it is ignored, and so is anything outside `node_modules`. The
 * repository's own source is the thing being described rather than a component of it.
 *
 * @param bundling - The build to read.
 * @returns Each package, by its directory, so two copies of one name are two entries.
 */
export function reached(bundling: Bundling): ReadonlyMap<string, Reached> {
  const held = new Map<string, Made>();

  /**
   * Returns the entry for a module's package, creating it on first sight.
   *
   * @param id - A module the build reached.
   * @returns The entry, or nothing when the module belongs to no installed package.
   */
  function entry(id: string): Made | undefined {
    if (!installed(id)) return undefined;

    const at = owning(id);

    if (at === undefined) return undefined;

    const already = held.get(at);

    if (already !== undefined) return already;

    const manifest = manifestAt(at);
    const named = manifest === undefined ? undefined : text(manifest, "name");

    if (manifest === undefined || named === undefined) return undefined;

    const made = { at, dependsOn: new Set<string>(), manifest, named };

    held.set(at, made);

    return made;
  }

  for (const id of bundling.getModuleIds()) {
    const from = entry(id);

    for (const imported of bundling.getModuleInfo(id)?.importedIds ?? []) {
      const to = owning(imported);

      if (to === undefined || to === owning(id)) continue;
      if (entry(imported) !== undefined && from !== undefined) from.dependsOn.add(to);
    }
  }

  return held;
}
