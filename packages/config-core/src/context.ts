/**
 * What a layer is told about the repository it is configuring.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type ConfigEnv, loadEnv } from "vite-plus";

/**
 * The parts of a manifest a layer has a reason to read.
 *
 * Narrower than what a `package.json` holds, and deliberately: a layer reaching for a field nobody
 * listed here is a layer whose need has not been stated, and stating it is the point at which
 * somebody asks whether the kernel should be answering that question at all.
 */
export interface Manifest {
  /**
   * What the package depends on at run time, by name and by range.
   */
  readonly dependencies?: Readonly<Record<string, string>>;

  /**
   * What the package publishes, by subpath.
   */
  readonly exports?: Readonly<Record<string, unknown>>;

  /**
   * What the package is called.
   */
  readonly name?: string;

  /**
   * What version it is at.
   */
  readonly version?: string;

  /**
   * Which directories the workspace holds, where this manifest declares one.
   */
  readonly workspaces?:
    | {
        /**
         * Which directories it holds, where the manifest states them under a key rather than as a
         * list of its own.
         */
        readonly packages?: readonly string[];
      }
    | readonly string[];
}

/**
 * What a layer is handed instead of the environment Vite+ passes on its own.
 *
 * Everything `ConfigEnv` carries, and the four answers a layer would otherwise have to work out for
 * itself. A layer written against `ConfigEnv` keeps compiling, because a function taking less is
 * satisfied by a caller passing more.
 *
 * Four fields, four owners. A fifth means it has become a bag to fish in, and the answer then is a
 * narrow dependency passed explicitly.
 */
export interface Context extends ConfigEnv {
  /**
   * Where the package being configured is, as an absolute path.
   *
   * Declared by the configuration rather than discovered, because neither answer a machine could
   * discover is reliable: `process.cwd()` is the workspace root under `vp test`, and the config
   * file's own frame is a bundled temporary file outside the package.
   */
  readonly at: string;

  /**
   * Every variable the repository's `.env` files and the surrounding shell hold.
   *
   * Three sources, each overriding the one before it: the workspace root's files, then the
   * package's own, then the shell. The root states what is true of the tree, a package overrides
   * what is true only of itself, and a variable given on the command line beats both — which is the
   * order `extends` already uses, where the nearer statement decides.
   *
   * Read with no prefix, so a variable meant for the configuration rather than for a browser is
   * visible here. None of it reaches a build: a browser is shown Vite+'s own `import.meta.env`,
   * filtered by its own prefix, which is a separate mechanism.
   */
  readonly env: Readonly<Record<string, string>>;

  /**
   * What the package's own manifest holds.
   *
   * Read once here rather than by each layer that wants a field of it, which is what stops four
   * blocks each opening the same file and disagreeing about what to do when it is absent.
   */
  readonly manifest: Manifest;

  /**
   * Where the workspace root is, as an absolute path.
   */
  readonly root: string;
}

/**
 * Reads a manifest, answering an empty one where the directory holds none.
 *
 * A missing manifest is not an error here. Whether a block can do its work without one is that
 * block's question, and `pack` answering differently from `test` is the reason this does not decide
 * for them.
 *
 * @param at - The directory to read it from.
 * @returns The fields it holds, or nothing where there is no manifest to read.
 */
function read(at: string): Manifest {
  const path = join(at, "package.json");

  if (!existsSync(path)) return {};

  const held: unknown = JSON.parse(readFileSync(path, "utf8"));

  return typeof held === "object" && held !== null ? held : {};
}

/**
 * Finds the workspace root above a directory.
 *
 * The root is the nearest ancestor whose manifest declares a workspace. Walking up from the package
 * finds it wherever a command is run from, because every package sits below the root that declares
 * it — which is what makes this answerable without being told, unlike the package itself.
 *
 * Not published. A layer wanting the root reads `context.root`, and a second way to ask the same
 * question is a second answer to keep true.
 *
 * @param from - Where to start looking.
 * @returns The workspace root, or the starting directory where nothing above it declares one.
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
 * Works out which package is being configured.
 *
 * The directory the configuration declares is the answer, with one exception. A package that ships
 * no configuration of its own is built by the workspace root's, and the declared directory is then
 * the root rather than the package — so where the root's configuration is the one running and the
 * command was pointed somewhere else holding a manifest, that somewhere else is the package.
 *
 * Neither answer works alone. A configuration read for a package while a command runs at the root,
 * which is what `vp test` does, has the right directory declared and the wrong one current; a
 * package with no configuration has the reverse.
 *
 * @param declared - The directory the configuration declared, as `import.meta.dirname`.
 * @param root - The workspace root above it.
 * @param from - Where the command is running.
 * @returns The package's directory.
 */
function configured(declared: string, root: string, from: string): string {
  if (declared !== root || from === root) return declared;

  return existsSync(join(from, "package.json")) ? from : declared;
}

/**
 * Reads the variables in force for a package.
 *
 * The workspace root answers first and the package overrides it, so a repository states what is
 * true of the whole tree once and a package restates only what differs. Where the package is the
 * root, one read answers both.
 *
 * The shell wins over either, which costs nothing to arrange: `loadEnv` already prefers a variable
 * it finds in the environment over the same name in a file, so a variable set on the command line
 * survives both reads.
 *
 * @param mode - The mode Vite+ resolved, which decides the `.env.<mode>` files.
 * @param at - Where the package is.
 * @param root - Where the workspace root is.
 * @returns Every variable, the nearer statement winning.
 */
function varied(mode: string, at: string, root: string): Record<string, string> {
  const shared = loadEnv(mode, root, "");

  return at === root ? shared : { ...shared, ...loadEnv(mode, at, "") };
}

/**
 * Builds what every layer is told.
 *
 * The environment is read here rather than by whichever layer wants it, because Vite+ defers
 * loading `.env` files until after a configuration has resolved — so a layer reading them itself
 * would read nothing. It is also why `mode` has to be in hand first, which it is only once Vite+
 * has called back.
 *
 * @param env - The command and the mode Vite+ has resolved.
 * @param declared - Where the configuration doing the defining is, as `import.meta.dirname`.
 * @param from - Where the command is running. The working directory unless stated.
 * @returns Everything a layer is handed when it is resolved.
 */
export function contextOf(env: ConfigEnv, declared: string, from: string = process.cwd()): Context {
  const root = rooted(declared);
  const at = configured(declared, root, from);

  return { ...env, at, env: varied(env.mode, at, root), manifest: read(at), root };
}
