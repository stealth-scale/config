/**
 * The plugin itself: it finds the catalogues, serves the module an application loads them from,
 * writes their types, and pushes a changed string to a running page.
 */

import { dirname, resolve } from "node:path";
import {
  type EnvironmentModuleNode,
  type HotUpdateOptions,
  normalizePath,
  type Plugin,
  type ViteDevServer,
} from "vite";

import { writeIfChanged } from "@stealthscale/vite-plugin-base";

import { problems } from "#check.ts";
import {
  type CatalogueIndex,
  cataloguesModule,
  filesOf,
  ID,
  indexed,
  mergedWords,
  type Pair,
  pairId,
  pairModule,
  pairOfId,
} from "#emit.ts";
import { type Catalogue, EXTENSION, found, LOCALES, namespaceOf } from "#find.ts";
import { declared } from "#typegen.ts";

export { ID };

/**
 * The resolved identifier, whose leading NUL marks the module as this plugin's.
 */
const RESOLVED = `\0${ID}`;

/**
 * The custom event name a changed catalogue is sent to the page under.
 *
 * @remarks
 *   The foundation listens for the same string. Neither package imports the other, so the name is a
 *   contract between them rather than a shared constant.
 */
export const EVENT = "i18n:catalogue";

/**
 * The default language that defines every key.
 */
const FALLBACK = "en";

/**
 * The default path the generated types are written to, against the project root.
 */
const TYPES = "src/i18n.gen.d.ts";

/**
 * The payload the change event carries.
 */
export interface Changed {
  /**
   * The BCP 47 tag of the language that changed.
   */
  readonly language: string;

  /**
   * The namespace.
   */
  readonly namespace: string;

  /**
   * Every file of the pair merged, so an override survives a change to the package it overrides.
   */
  readonly words: Readonly<Record<string, unknown>>;
}

/**
 * Configures the catalogues.
 */
export interface Options {
  /**
   * Inlines every language rather than the fallback alone, so nothing is fetched. Off by default.
   */
  readonly eager?: boolean | undefined;

  /**
   * The language every key is defined in, which is inlined for the first paint. `en` by default.
   */
  readonly fallback?: string | undefined;

  /**
   * Decides which namespaces to keep, given each name. Keeps every one by default.
   */
  readonly namespaces?: ((namespace: string) => boolean) | undefined;

  /**
   * The scopes whose packages are searched. The application's own scope by default.
   */
  readonly scopes?: readonly string[] | undefined;

  /**
   * Where to write the types, against the project root, or false to write none.
   * `src/i18n.gen.d.ts` by default, which the house treats as generated and excludes from coverage.
   */
  readonly types?: false | string | undefined;
}

/**
 * The two fields the plugin reads from a resolved configuration.
 */
interface Resolved {
  /**
   * Whether the bundler is building or serving.
   */
  readonly command: "build" | "serve";

  /**
   * The project root the search starts from.
   */
  readonly root: string;
}

/**
 * The environment's channel to the page.
 */
interface Channel {
  /**
   * Sends a custom event to the page.
   */
  readonly send: (event: string, payload: Changed) => void;
}

/**
 * The part of a module graph the update hook reads.
 */
interface Graph {
  /**
   * Returns a module by its resolved identifier, or undefined when nothing imported it.
   */
  readonly getModuleById: (id: string) => EnvironmentModuleNode | undefined;

  /**
   * Invalidates a module, so the next import reloads it.
   */
  readonly invalidateModule?: ((node: EnvironmentModuleNode) => void) | undefined;
}

/**
 * The environment an update hook is called on.
 */
interface Watching {
  /**
   * The environment a file changed in.
   */
  readonly environment: {
    /**
     * The channel to the page.
     */
    readonly hot: Channel;

    /**
     * The module graph to invalidate through.
     */
    readonly moduleGraph: Graph;
  };
}

/**
 * The state the plugin carries between hooks.
 */
interface State {
  /**
   * Every catalogue found, filtered by the namespaces option.
   */
  catalogues: readonly Catalogue[];

  /**
   * The same catalogues indexed by language and namespace.
   */
  index: CatalogueIndex;

  /**
   * The resolved configuration, set before any other hook runs.
   */
  resolved: Resolved;
}

/**
 * Searches for the catalogues again and indexes them, keeping the namespaces the options accept.
 *
 * @param state - The state to write the result into.
 * @param options - Where to search and which namespaces to keep.
 */
function refound(state: State, options: Options): void {
  const wanted = options.namespaces ?? ((): boolean => true);

  state.catalogues = found(state.resolved.root, options.scopes).filter((one) =>
    wanted(one.namespace),
  );
  state.index = indexed(state.catalogues);
}

/**
 * Writes the generated types, unless the options turn them off.
 *
 * @param state - The catalogues found.
 * @param options - Where to write and which language types the keys.
 * @returns True when the file changed.
 */
function retyped(state: State, options: Options): boolean {
  if (options.types === false) return false;

  return writeIfChanged(
    resolve(state.resolved.root, options.types ?? TYPES),
    declared(state.index, options.fallback ?? FALLBACK),
  );
}

/**
 * Formats each fault in the catalogues as one line.
 *
 * @param state - The catalogues found.
 * @param options - Which language defines the keys.
 */
function wrong(state: State, options: Options): readonly string[] {
  return problems(state.index, options.fallback ?? FALLBACK).map(
    ({ file: at, key, says }) => `${at}${key === "" ? "" : `: ${key}`} ${says}`,
  );
}

/**
 * Reads the pair a catalogue file belongs to out of its path.
 *
 * @param path - A normalised path under a `locales` directory.
 * @returns The pair, or undefined when no language directory sits under `locales`.
 */
function pairOf(path: string): Pair | undefined {
  const rest = path.slice(path.lastIndexOf(`/${LOCALES}/`) + LOCALES.length + 2);
  const at = rest.indexOf("/");

  if (at === -1) return undefined;

  return { language: rest.slice(0, at), namespace: namespaceOf(rest.slice(at + 1)) };
}

/**
 * Returns true when a path is a catalogue file.
 *
 * @param path - A normalised path.
 */
function catalogued(path: string): boolean {
  return EXTENSION.test(path) && path.includes(`/${LOCALES}/`);
}

/**
 * Invalidates a module when the graph holds it, and does nothing when nothing imported it.
 *
 * @param graph - The module graph.
 * @param id - The module's resolved identifier.
 */
function stale(graph: Graph, id: string): void {
  const node = graph.getModuleById(id);

  if (node !== undefined) graph.invalidateModule?.(node);
}

/**
 * Pushes a changed pair to a running page and invalidates the modules holding the old strings.
 *
 * @remarks
 *   The catalogues module is invalidated as well, because the fallback language is inlined in it,
 *   so a page loaded after the change gets the current strings.
 * @param state - The catalogues found.
 * @param options - Which language defines the keys, for the validation that follows.
 * @param pair - The language and namespace that changed.
 * @param watching - The environment the file changed in.
 */
function resent(state: State, options: Options, pair: Pair, watching: Watching): void {
  stale(watching.environment.moduleGraph, `\0${pairId(pair.language, pair.namespace)}`);
  stale(watching.environment.moduleGraph, RESOLVED);
  watching.environment.hot.send(EVENT, {
    language: pair.language,
    namespace: pair.namespace,
    words: mergedWords(filesOf(state.index, pair.language, pair.namespace)),
  });

  for (const line of wrong(state, options)) globalThis.console.warn(line);
}

/**
 * Handles a catalogue file that was added or deleted.
 *
 * @remarks
 *   The search and the types run again, because the set of languages may have changed. The module
 *   is invalidated rather than sent, because sending it would refresh the component tree when only
 *   the strings changed.
 * @param state - The catalogues found.
 * @param options - Where to search.
 * @param path - The file that appeared or disappeared.
 * @param watching - The environment the file changed in.
 */
function refollowed(state: State, options: Options, path: string, watching: Watching): void {
  refound(state, options);
  retyped(state, options);

  const pair = pairOf(path);

  if (pair === undefined) stale(watching.environment.moduleGraph, RESOLVED);
  else resent(state, options, pair, watching);
}

/**
 * Builds the plugin that finds the catalogues, types their keys, and serves `virtual:i18n`.
 *
 * @remarks
 *   On a dev server a catalogue change is pushed to the page as an event rather than a reload, so
 *   the page keeps its state. In a build an invalid catalogue throws instead.
 * @param options - Where to search and what to write. `Options` documents every member.
 * @returns The plugin.
 */
export function i18n(options: Options = {}): Plugin {
  const state: State = {
    catalogues: [],
    index: new Map(),
    resolved: { command: "serve", root: process.cwd() },
  };

  return {
    /**
     * Throws on an invalid catalogue during a build, and warns during a dev server run.
     *
     * @throws {@link Error} When a catalogue defines an unknown key or drops a placeholder.
     */
    buildStart(): void {
      const lines = wrong(state, options);

      if (lines.length === 0) return;
      if (state.resolved.command === "build") throw new Error(lines.join("\n"));

      for (const line of lines) this.warn(line);
    },

    /**
     * Records the root, runs the search, and writes the types.
     *
     * @param config - The resolved configuration.
     */
    configResolved(config: Resolved): void {
      state.resolved = config;
      refound(state, options);
      retyped(state, options);
    },

    /**
     * Adds every `locales` directory to the watcher, including those outside the project root.
     *
     * @param server - The dev server.
     */
    configureServer(server: ViteDevServer): void {
      server.watcher.add([...new Set(state.catalogues.map((one) => dirname(dirname(one.file))))]);
    },

    /**
     * Handles a catalogue change on a dev server by pushing the new strings to the page.
     *
     * @param changed - The file, what happened to it, and the modules the change reached.
     * @returns An empty array for a catalogue, or undefined for any other file.
     */
    hotUpdate(this: Watching, changed: HotUpdateOptions): EnvironmentModuleNode[] | undefined {
      const path = normalizePath(changed.file);

      if (!catalogued(path)) return undefined;

      if (changed.type !== "update") {
        refollowed(state, options, path, this);

        return [];
      }

      const catalogue = state.catalogues.find((one) => one.file === path);

      if (catalogue === undefined) return undefined;

      resent(state, options, catalogue, this);

      return [];
    },

    /**
     * Serves the catalogues module, or the module one pair is fetched as.
     *
     * @param id - The module being loaded.
     * @returns The source, or undefined when the module is not this plugin's.
     */
    load(id: string): string | undefined {
      if (id === RESOLVED) {
        return cataloguesModule(state.index, options.fallback ?? FALLBACK, options.eager ?? false);
      }

      const pair = pairOfId(id);

      return pair === undefined
        ? undefined
        : pairModule(filesOf(state.index, pair.language, pair.namespace));
    },

    name: "stealth:i18n",

    /**
     * Claims the catalogues specifier and every pair specifier.
     *
     * @param id - The specifier being resolved.
     * @returns The resolved identifier, or undefined for any other import.
     */
    resolveId(id: string): string | undefined {
      return id === ID || pairOfId(id) !== undefined ? `\0${id}` : undefined;
    },

    /**
     * Runs the search and the types again during a watching build.
     *
     * @remarks
     *   A dev server reports the same change to `hotUpdate`, which pushes the strings to the page,
     *   so this hook ignores a change while serving. A watching build has no page and rebuilds.
     * @param id - The file that changed.
     */
    watchChange(id: string): void {
      if (state.resolved.command !== "build" || !catalogued(normalizePath(id))) return;

      refound(state, options);
      retyped(state, options);
    },
  };
}
