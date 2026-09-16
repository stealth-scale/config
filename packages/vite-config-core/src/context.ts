/**
 * Works out what is being configured, and hands it to every layer.
 *
 * @remarks
 *   Both exports read a `package.json` on the way, so a manifest that is
 *   present and not valid JSON throws out of either one. A directory holding no
 *   manifest at all is not an error.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type ConfigEnv, loadEnv } from "vite";

import { workspaces } from "#workspace.ts";

/**
 * The parts of a `package.json` the kernel reads.
 *
 * @remarks
 *   Every field is optional, because a directory with no manifest is handed to
 *   a layer as an empty object rather than as undefined. The fields a manifest
 *   carries beyond these are dropped.
 */
export interface Manifest {
  /**
   * Maps each run-time dependency to the range the package declares.
   */
  readonly dependencies?: Readonly<Record<string, string>>;

  /**
   * The entry points the package publishes, unresolved.
   */
  readonly exports?: Readonly<Record<string, unknown>>;

  /**
   * The published name, absent for a private root.
   */
  readonly name?: string;

  /**
   * The version as written, never a range.
   */
  readonly version?: string;

  /**
   * Each workspace glob, whichever package manager declared it.
   */
  readonly workspaces?: readonly string[];
}

/**
 * Describes to a layer what is being configured and where it sits.
 *
 * @remarks
 *   The four fields here are settled once per composition and handed to every
 *   layer, so no layer has to walk the file system to find out where it is.
 */
export interface Context extends ConfigEnv {
  /**
   * The directory being configured, which is the root for a workspace-wide run.
   */
  readonly at: string;

  /**
   * Every variable in scope, merged from the root, the package and the shell.
   */
  readonly env: Readonly<Record<string, string>>;

  /**
   * The manifest sitting at `at`, or an empty object where there is none.
   */
  readonly manifest: Manifest;

  /**
   * The workspace root, equal to `at` outside a workspace.
   */
  readonly root: string;
}

/**
 * Loads the manifest in a directory and normalises the workspace globs it declares.
 *
 * @remarks
 *   A missing file and a file holding something other than an object both give
 *   an empty manifest. The `workspaces` field is filled from wherever the
 *   package manager put it, so a pnpm repository reports globs its manifest
 *   never mentions.
 * @throws {@link SyntaxError} When the file exists and holds invalid JSON.
 */
function read(at: string): Manifest {
  const path = join(at, "package.json");

  if (!existsSync(path)) return {};

  const held: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (typeof held !== "object" || held === null) return {};

  const stated = workspaces(at, Object.fromEntries(Object.entries(held)));

  return stated === undefined ? held : { ...held, workspaces: stated };
}

/**
 * Climbs from a directory to the workspace root above it.
 *
 * @remarks
 *   The first directory declaring any workspace globs wins, including one
 *   declaring an empty list. A directory with nothing above it that declares a
 *   workspace is its own root, which is what a standalone package gets.
 */
export function rooted(from: string): string {
  for (let at = from; ;) {
    if (read(at).workspaces !== undefined) return at;

    const up = dirname(at);

    if (up === at) return from;

    at = up;
  }
}

/**
 * Chooses between the declared directory and the one the command was run from.
 *
 * @remarks
 *   A run started inside a package that has no config of its own is configuring
 *   that package, even though the root config is the file doing the work. A
 *   package holding its own config is left alone, because that config declares
 *   its own directory when it runs.
 */
function configured(declared: string, root: string, from: string): string {
  if (declared !== root || from === root) return declared;

  return existsSync(join(from, "package.json")) && !configures(from) ? from : declared;
}

/**
 * Every filename Vite accepts for a config, in the order it looks for them.
 */
const CONFIGS = ["js", "mjs", "cjs", "ts", "mts", "cts"].map(
  (extension) => `vite.config.${extension}`,
);

/**
 * Reports whether a directory holds a config of its own.
 */
function configures(at: string): boolean {
  return CONFIGS.some((name) => existsSync(join(at, name)));
}

/**
 * Collects the variables in scope for one directory.
 *
 * @remarks
 *   The root's files are read first and the package's are laid over them, so a
 *   package redeclaring a variable wins and one it leaves alone survives. No
 *   prefix is required, and the shell beats both because the loader folds the
 *   process environment in last.
 */
function varied(mode: string, at: string, root: string): Record<string, string> {
  const shared = loadEnv(mode, root, "");

  return at === root ? shared : { ...shared, ...loadEnv(mode, at, "") };
}

/**
 * Settles the context a composition hands to each of its layers.
 *
 * @remarks
 *   The directory is declared rather than discovered because a config is
 *   bundled to a temporary file outside its own package before it runs, which
 *   leaves `import.meta.dirname` as the only spelling that survives.
 * @param env - The command and mode Vite is invoking the config for.
 * @param declared - The directory the config names for itself.
 * @param from - Where the command was run, which decides the package for a
 *   root-level config.
 * @throws {@link SyntaxError} When a manifest on the way up holds invalid JSON.
 */
export function contextOf(env: ConfigEnv, declared: string, from: string = process.cwd()): Context {
  const root = rooted(declared);
  const at = configured(declared, root, from);

  return { ...env, at, env: varied(env.mode, at, root), manifest: read(at), root };
}
