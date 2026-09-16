/**
 * Recovers the installed packages that stand behind a finished module graph.
 *
 * @remarks
 *   Every reader here answers undefined, or an empty result, where the file
 *   system refuses. A build never fails because one dependency shipped an
 *   unreadable manifest or a directory nobody can list.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";

import { type Bundling } from "#plugin.ts";

/**
 * A parsed package.json, held as it was read rather than as a known shape.
 *
 * @remarks
 *   Somebody else authored the document, so no field is guaranteed to exist or
 *   to hold the type its name suggests. A caller reaches a field through a
 *   reader that checks, such as {@link text}.
 */
export type Manifest = Readonly<Record<string, unknown>>;

/**
 * Answers the value of a manifest field when that field holds a string.
 *
 * @remarks
 *   A field holding a number, an object or null reads the same as a field that
 *   is absent. A caller that has to tell the two apart indexes the manifest
 *   itself.
 */
export function text(manifest: Manifest, field: string): string | undefined {
  const held = manifest[field];

  return typeof held === "string" ? held : undefined;
}

/**
 * One installed package a build imported from, and what it imported in turn.
 *
 * @remarks
 *   Two installs of one name are two entries, because a build can bundle both
 *   and a consumer has to account for each copy separately.
 */
export interface Reached {
  /**
   * The package's own directory, absolute.
   */
  at: string;

  /**
   * The directories of the packages this one imported from.
   */
  dependsOn: ReadonlySet<string>;

  /**
   * The package.json parsed out of that directory.
   */
  manifest: Manifest;

  /**
   * The name the manifest declares, which need not match the directory.
   */
  named: string;
}

/**
 * Walks up from a file to the directory of the package that holds it.
 *
 * @remarks
 *   The nearest package.json above the file wins, so one nested inside a
 *   package's own source hides the package around it. The walk gives up at the
 *   file system root and answers undefined there.
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
 * Parses the package.json sitting in one directory.
 *
 * @remarks
 *   A missing file, JSON that does not parse, and a document parsing to
 *   anything but an object all answer undefined. A directory holding no package
 *   and one holding a broken package are not told apart.
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
 * Reports whether a module path runs through an installed package.
 *
 * @remarks
 *   The test splits the path into segments, so a directory called
 *   `node_modules_old` is not mistaken for an install. A file the repository
 *   itself owns is the subject of a build rather than a component of it.
 */
function installed(id: string): boolean {
  return id.split(sep).includes("node_modules");
}

/**
 * Matches the file names a package ships its licence text under.
 */
const LICENCES = /^(?:licen[cs]e|copying)(?:\..*)?$/iu;

/**
 * One licence file a package ships, with the text it carries.
 */
export interface Licensed {
  /**
   * The file name exactly as it sits in the package directory.
   */
  named: string;

  /**
   * The whole file, decoded as UTF-8.
   */
  text: string;
}

/**
 * Collects the licence files a package ships, together with their contents.
 *
 * @remarks
 *   Only the package's top directory is listed, so a licence filed in a
 *   subdirectory is passed over. A directory that cannot be listed yields an
 *   empty array, which reads the same as a package shipping no licence at all.
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
 * A package part-way through the crawl, whose dependency set still grows.
 *
 * @remarks
 *   This carries the fields of {@link Reached} with a mutable set. The map is
 *   filled through this shape and handed out through the readonly one, so a
 *   caller cannot add a dependency the graph never showed.
 */
interface Made {
  /**
   * The directory holding this package's manifest.
   */
  at: string;

  /**
   * The directories imported from, added as the crawl meets them.
   */
  dependsOn: Set<string>;

  /**
   * The manifest, parsed once when the package was first met.
   */
  manifest: Manifest;

  /**
   * The name read out of that manifest.
   */
  named: string;
}

/**
 * Gathers every installed package a finished build imported from.
 *
 * @remarks
 *   The answer comes from the graph rather than from any manifest. A manifest
 *   names what was asked for, including what the bundler went on to drop, and
 *   says nothing about what arrived through another package, the way
 *   `scheduler` arrives through React.
 * @returns Each package the build reached, keyed by its own directory.
 */
export function reached(bundling: Bundling): ReadonlyMap<string, Reached> {
  const held = new Map<string, Made>();

  /**
   * Records the package a module belongs to, or finds the record already made.
   *
   * @remarks
   *   A module outside node_modules, one with no manifest above it, and one
   *   whose manifest declares no name all answer undefined and stay out of the
   *   result. A package met a second time is handed back rather than parsed
   *   again.
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
