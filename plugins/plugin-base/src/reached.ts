/**
 * Which packages a build actually reached, read from the graph rather than from a manifest.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";

import { type Bundling } from "#plugin.ts";

/**
 * What a package's manifest holds.
 *
 * Every field, untyped. A manifest is whatever somebody wrote, and a plugin reading one wants
 * fields no interface here could usefully enumerate — `license`, `homepage`, `bugs`, `author`,
 * whichever a given inventory format asks for. `text` is how a field is read safely.
 */
export type Manifest = Readonly<Record<string, unknown>>;

/**
 * Reads one text field out of a manifest.
 *
 * @param manifest - The manifest to read.
 * @param field - Which field.
 * @returns Its value, or nothing where the field is absent or is not text.
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
   * asked for, including what the bundler dropped; this names what one package actually reached for
   * in the build being described.
   */
  dependsOn: ReadonlySet<string>;

  /**
   * What its manifest holds.
   */
  manifest: Manifest;

  /**
   * What it is called, which the manifest had to state for this to be a package at all.
   */
  named: string;
}

/**
 * Finds the directory of the package a file belongs to.
 *
 * Walks up from the file to the nearest manifest, which is what a resolver does and therefore the
 * only answer that agrees with the one the bundler used. Reading the path instead would have to
 * know every layout a package manager writes — bun nests a second `node_modules` inside `.bun`,
 * pnpm writes a store, npm hoists — and would be wrong on whichever it had not been told about.
 *
 * @param from - A file the build reached.
 * @returns The package's directory, or nothing above the file system root.
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
 * Reads the manifest in a directory, answering nothing where it cannot be read.
 *
 * @param at - The package's directory.
 * @returns The fields it holds, or nothing where there is no manifest or it does not parse.
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
 * Answers whether a module came from a package rather than from the repository being built.
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
 * The text rather than the manifest's `license` field, which is a declaration: an SPDX identifier
 * somebody typed. The file beside it is the evidence, and the two disagree often enough that a
 * licence review cannot lean on the first alone.
 *
 * Only the package's own directory is read, not below it. A licence deeper in the tree belongs to
 * something the package vendored, which is that thing's evidence rather than this one's.
 *
 * @param at - The package's directory.
 * @returns Each licence file, or none where the package ships no text.
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
 * A package being gathered, before the map is answered.
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
   * What it is called, which the manifest had to state for this to be a package at all.
   */
  named: string;
}

/**
 * Every installed package the build reached, each once.
 *
 * The graph rather than the manifest, which is the whole point: a bundler inlines what it reached,
 * including what it reached through something else. A manifest names direct dependencies, so an
 * inventory built from one describes what was asked for rather than what is in the artefact —
 * `scheduler` arrives through React and appears in no application's manifest.
 *
 * A module with no manifest above it is passed over. So is anything outside `node_modules`: the
 * repository's own source is the thing being described rather than a component of it.
 *
 * @param bundling - The build to read.
 * @returns Each package, by its directory, so two copies of one name are two entries.
 */
export function reached(bundling: Bundling): ReadonlyMap<string, Reached> {
  const held = new Map<string, Made>();

  /**
   * Answers the entry for a module's package, making it on first sight.
   *
   * @param id - A module the build reached.
   * @returns The entry, or nothing where the module belongs to no installed package.
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
