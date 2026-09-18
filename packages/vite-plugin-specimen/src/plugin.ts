/**
 * Implements the plugin: it finds the specimen files, serves the modules a catalogue imports, and
 * invalidates them when a file changes.
 */

import { readFileSync } from "node:fs";
import {
  type EnvironmentModuleGraph,
  type EnvironmentModuleNode,
  type Plugin,
  type UserConfig,
} from "vite";

import { type Changed, type Indexing, pageOf, pathOf, reindexes } from "#changed.ts";
import { fragmented, type Listed, listings, type Resolved, written } from "#emit.ts";
import { found, roots } from "#found.ts";
import { fragments } from "#fragments.ts";
import { FRAGMENTS, ID, type Options } from "#options.ts";

/**
 * The resolved identifier of the index, whose leading NUL marks the module as this plugin's.
 */
const RESOLVED = `\0${ID}`;

/**
 * The resolved identifier prefix of a page's fragments. The page's identifier follows it.
 */
const RESOLVED_FRAGMENTS = `\0${FRAGMENTS}`;

/**
 * The build output the watcher ignores.
 *
 * @remarks
 *   The watched directories are whole package trees, so a coverage report would be watched too, and
 *   a changed HTML file the server holds no module for triggers a full reload.
 */
const OUTPUTS: readonly string[] = ["**/coverage/**"];

/**
 * Describes the part of a dev server the plugin reads.
 *
 * @remarks
 *   Narrower than Vite's own type, so a specification supplies a watcher instead of a whole server.
 */
interface Watcher {
  /**
   * The file watcher the plugin adds directories to.
   */
  readonly watcher: {
    /**
     * Watches each directory for a file appearing under it.
     */
    readonly add: (paths: readonly string[]) => void;
  };
}

/**
 * Describes the part of a hot update the plugin reads.
 *
 * @remarks
 *   Narrower than Vite's own type, which also carries the dev server. A specification therefore
 *   builds an update without one.
 */
interface Updated extends Changed {
  /**
   * The modules the bundler already resolved for the change.
   */
  readonly modules: readonly EnvironmentModuleNode[];
}

/**
 * Describes the part of an environment the update hook reads.
 */
interface Watching {
  /**
   * The environment the file changed in.
   */
  readonly environment: {
    /**
     * The module graph, which reports whether a module was ever loaded.
     */
    readonly moduleGraph: Pick<EnvironmentModuleGraph, "getModuleById">;
  };
}

/**
 * Describes a generated module and the absence of a source map for it.
 */
interface Written {
  /**
   * The generated source.
   */
  readonly code: string;

  /**
   * Null, because the module was generated rather than transformed.
   */
  readonly map: null;
}

/**
 * Describes the state one plugin instance carries between hooks.
 */
interface State {
  /**
   * Each file's listing and identifier, as the index was last generated.
   */
  last: ReadonlyMap<string, Listed>;

  /**
   * The root and command the bundler resolved.
   */
  resolved: Resolved;

  /**
   * The absolute directories the patterns start searching in.
   */
  watched: readonly string[];
}

/**
 * Generates the module under one resolved identifier.
 *
 * @returns The generated source, or undefined when the identifier is not this plugin's.
 * @throws {@link Error} When the patterns match nothing, a build meets a file it cannot read, or
 *   the requested fragments belong to no listed page.
 */
function generated(state: State, patterns: readonly string[], id: string): string | undefined {
  if (id === RESOLVED) {
    state.last = listings(state.resolved, found(state.resolved.root, patterns));

    return written([...state.last.values()].map((listed) => listed.listing));
  }

  if (!id.startsWith(RESOLVED_FRAGMENTS)) return undefined;

  const path = pathOf(state, id.slice(RESOLVED_FRAGMENTS.length));

  return fragmented(fragments({ path, text: readFileSync(path, "utf8") }));
}

/**
 * Returns the fragments module of a changed page.
 *
 * @returns The module node, and an empty array when nothing imported it.
 */
function refragmented(
  indexing: Indexing,
  file: string,
  graph: Watching["environment"]["moduleGraph"],
): EnvironmentModuleNode[] {
  const page = pageOf(indexing, file);
  const node = page === undefined ? undefined : graph.getModuleById(`${RESOLVED_FRAGMENTS}${page}`);

  return node === undefined ? [] : [node];
}

/**
 * Builds the plugin that indexes the specimens the patterns match.
 *
 * @remarks
 *   The index is generated when a catalogue first imports it, and again whenever a page appears,
 *   disappears, or changes the metadata it declares. Editing a scene reloads its page and leaves
 *   the index alone.
 * @param options - Where to search. `Options` documents every member.
 */
export function specimens(options: Options): Plugin {
  const state: State = {
    last: new Map(),
    resolved: { command: "build", root: process.cwd() },
    watched: [],
  };

  return {
    /**
     * Excludes build output from the watcher, because the watched directories are whole trees.
     */
    config(): UserConfig {
      return { server: { watch: { ignored: [...OUTPUTS] } } };
    },

    /**
     * Records the root the patterns resolve against and the command the bundler is running.
     *
     * @remarks
     *   Read from the resolved configuration rather than from the process, because under a task
     *   runner the working directory is the workspace root.
     */
    configResolved(config: Resolved): void {
      state.resolved = config;
      state.watched = roots(config.root, options.patterns);
    },

    /**
     * Adds the directories the patterns start in to the watcher, including those outside the root.
     */
    configureServer(server: Watcher): void {
      server.watcher.add([...state.watched]);
    },

    /**
     * Adds the plugin's own modules to the ones a change invalidates.
     *
     * @returns The modules to reload, or undefined when the change reaches none of this plugin's.
     */
    async hotUpdate(
      this: Watching,
      changed: Updated,
    ): Promise<EnvironmentModuleNode[] | undefined> {
      const graph = this.environment.moduleGraph;
      const reloaded = [...changed.modules, ...refragmented(state, changed.file, graph)];
      const index = (await reindexes(state, options.patterns, changed))
        ? graph.getModuleById(RESOLVED)
        : undefined;

      if (index !== undefined) reloaded.push(index);

      return reloaded.length === changed.modules.length ? undefined : reloaded;
    },

    /**
     * Serves the index or one page's fragments.
     *
     * @remarks
     *   Served without a source map. Both modules are generated rather than transformed, and the
     *   bundler generates a map anyway unless the hook returns one explicitly. The maps were four
     *   fifths of the payload: a 289 kB index carried 232 kB of map, which a catalogue pays on
     *   every page.
     * @returns The generated source and a null map, or undefined when the module is not this
     *   plugin's.
     */
    load(id: string): undefined | Written {
      const code = generated(state, options.patterns, id);

      return code === undefined ? undefined : { code, map: null };
    },

    name: "stealth:specimens",

    /**
     * Claims the index specifier and every fragments specifier.
     *
     * @returns The resolved identifier, or undefined for any other import.
     */
    resolveId(id: string): string | undefined {
      if (id === ID) return RESOLVED;

      return id.startsWith(FRAGMENTS) ? `\0${id}` : undefined;
    },
  };
}
