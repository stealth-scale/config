/**
 * Compiles the application's stylesheet, and recompiles it when anything behind it changes.
 *
 * @remarks
 *   An application is the only package that can compile a stylesheet, because it is the only one
 *   that knows both the components on the page and the themes they are drawn in. What it writes by
 *   hand is one file naming its themes; everything else is derived from its dependencies.
 */

import { extname } from "node:path";
import {
  type DevEnvironment,
  type EnvironmentModuleNode,
  type Plugin,
  type ViteDevServer,
} from "vite";

import { type Loading } from "@stealthscale/vite-plugin-base";

import { rewritten } from "#compiler.ts";
import { reportDiagnostics } from "#diagnostics.ts";
import { renderStylesheet } from "#fonts.ts";
import { layerPattern, type Options, type Resolved, resolveOptions } from "#options.ts";
import { type SourceChange } from "#pandacss.ts";
import { assemble, type Assembled } from "#theme/assembly.ts";

/**
 * Fixes what the stylesheet is resolved to.
 *
 * @remarks
 *   A module rather than a file. The stylesheet is generated, and a generated file inside an
 *   application would have to be committed or served out of `node_modules`.
 */
const VIRTUAL = "virtual:stealth-theme.css";

/**
 * The kinds of change a bundler reports about a file, which a dev server's hot update and a build's
 * watch report under the same names.
 */
type Event = "create" | "delete" | "update";

/**
 * Maps a bundler's change event to the change the compiler applies.
 */
const KINDS: Readonly<Record<Event, SourceChange["kind"]>> = {
  create: "add",
  delete: "unlink",
  update: "change",
};

/**
 * Carries the rules compiled from one generation of the compiler.
 */
interface Compiled {
  /**
   * The compiled rules, with what names the compiler removed.
   */
  css: string;

  /**
   * The generation of the compiler the rules were compiled from.
   */
  generation: number;
}

/**
 * Carries everything the plugin holds between its hooks.
 */
interface Running {
  /**
   * The compiler and what it was assembled from, once assembled.
   */
  assembled?: Assembled | undefined;

  /**
   * The rules compiled from the current generation, once a stylesheet asked for them.
   */
  compiled?: Compiled | undefined;

  /**
   * Counts the assemblies and the changes applied to the compiler, so rules compiled before a
   * change are not served after it.
   */
  generation: number;

  /**
   * Where the application is, and the conditions it resolves under.
   */
  loading: Loading;

  /**
   * The dev server, where one is running.
   */
  server?: undefined | ViteDevServer;

  /**
   * Every stylesheet the compiled rules were appended to.
   */
  sheets: Set<string>;
}

/**
 * Reads an identifier without whatever a request appended to it.
 */
function bare(id: string): string {
  return id.replace(/\?.*$/su, "");
}

/**
 * Assembles the compiler once, and returns the same assembly until something drops it.
 *
 * @remarks
 *   An assembly is a new generation, so rules compiled from the one before are compiled again.
 *   Under a dev server the source directory of every workspace package the compiler scans is
 *   handed to the watcher, because the server watches its own root alone and a file added to a
 *   package beside the application would otherwise reach the compiler only when it restarts.
 */
async function ready(state: Running, resolved: Resolved): Promise<Assembled> {
  if (state.assembled === undefined) {
    state.assembled = await assemble(state.loading, resolved, state.server);
    state.generation += 1;
    state.server?.watcher.add([...state.assembled.roots]);
  }

  return state.assembled;
}

/**
 * Lists what each face the themes named is imported as: its file, or its name where nothing
 * resolved it.
 */
function faces(state: Running): readonly string[] {
  return [...(state.assembled?.fonts ?? [])].map(([name, file]) => file ?? name);
}

/**
 * Invalidates the stylesheets the compiled rules were appended to, so the next request
 * retransforms them.
 *
 * @remarks
 *   A stylesheet the graph no longer holds is forgotten, so a sheet renamed while the server runs
 *   is not looked up on every change for the life of the process.
 */
function invalidated(environment: DevEnvironment, sheets: Set<string>): EnvironmentModuleNode[] {
  const found: EnvironmentModuleNode[] = [];

  for (const id of sheets) {
    const module = environment.moduleGraph.getModuleById(id);

    if (module === undefined) {
      sheets.delete(id);
    } else {
      environment.moduleGraph.invalidateModule(module);
      found.push(module);
    }
  }

  return found;
}

/**
 * The part of a transform's context the compile reads: the watch list and the warning channel.
 */
interface Transforming {
  /**
   * Adds a file whose change retransforms the module.
   */
  addWatchFile: (file: string) => void;

  /**
   * Puts a message in front of the person running the build.
   */
  warn: (message: string) => void;
}

/**
 * Compiles the rules once per generation, renames every class selector into the scheme, reports
 * what the compiler and the rename found, and returns the rules.
 *
 * @remarks
 *   Every stylesheet that declares the cascade order receives the same rules, so the compile and
 *   the rename run once for a generation however many stylesheets ask, and the diagnostics are
 *   reported once with them. An application whose graph names no package publishing a preset
 *   beside the system package compiles a stylesheet carrying the foundation's values and no
 *   component's rules, which is a blank-looking page and a build that succeeded, so that is
 *   reported here too.
 */
function compiled(state: Running, assembled: Assembled, warn: Transforming["warn"]): string {
  if (state.compiled?.generation === state.generation) return state.compiled.css;

  const { compiler, contributors } = assembled;
  const output = compiler.driver.cssgen({ emitLayerDeclaration: false });
  const renamed = rewritten(compiler, output.css);

  reportDiagnostics(compiler.driver.designSystemDiagnostics, "the design system", warn);
  reportDiagnostics(output.diagnostics, "the stylesheet", warn);
  reportDiagnostics(renamed.diagnostics, "the class names", warn);

  if (contributors.length === 1) {
    warn(
      "No package on this application's dependency graph publishes a preset under ./theme " +
        "beside the system package, so the stylesheet carries the foundation's values and no " +
        "component's rules.",
    );
  }

  state.compiled = { css: renamed.css, generation: state.generation };

  return state.compiled.css;
}

/**
 * Appends the compiled rules to a stylesheet, and asks the bundler to watch everything behind them.
 */
function appended(
  state: Running,
  assembled: Assembled,
  context: Transforming,
  code: string,
): string {
  for (const file of [...assembled.watched, ...assembled.sources]) context.addWatchFile(file);

  return `${code}\n${compiled(state, assembled, context.warn.bind(context))}`;
}

/**
 * Applies a changed file to the compiler: a file behind the configuration restarts it, a source
 * file is handed to it, and any other file is left alone.
 *
 * @remarks
 *   The compiler reads a changed file from disk itself, so the change carries no content, and a
 *   deleted file is reported as one rather than read. A file outside the compiler's globs is left
 *   alone before the compiler is asked, because the compiler reads a file it is handed before it
 *   decides whether the file is one it scans.
 * @returns True when the compiler changed, so rules compiled before the change are stale.
 */
async function applied(
  state: Running,
  resolved: Resolved,
  file: string,
  event: Event,
): Promise<boolean> {
  const assembled = state.assembled;

  if (assembled === undefined) return false;

  if (assembled.watched.includes(file)) {
    state.assembled = undefined;
    await ready(state, resolved);

    return true;
  }

  const { driver } = assembled.compiler;

  if (!driver.isSourceFile(file) || !driver.applyChange({ kind: KINDS[event], path: file })) {
    return false;
  }

  state.generation += 1;

  return true;
}

/**
 * Builds the plugin that compiles the application's stylesheet.
 *
 * @remarks
 *   The plugin runs before Vite's own CSS handling, so the compiled rules are in the stylesheet by
 *   the time Vite processes it. The compiler starts at `buildStart` rather than when the
 *   configuration resolves, because resolving a configuration is also how a workspace plans its
 *   build graph.
 */
export function stylesheet(options: Options = {}): Plugin {
  const resolved = resolveOptions(options);
  const declared = layerPattern(resolved.layers);
  const state: Running = { generation: 0, loading: { root: process.cwd() }, sheets: new Set() };

  return {
    enforce: "pre",
    name: "stealth:theme.stylesheet",

    /**
     * Records where the application is and under which conditions it resolves.
     */
    configResolved(config) {
      state.loading = { conditions: config.ssr.resolve?.conditions, root: config.root };
    },

    /**
     * Keeps the dev server, whose runner the statement and the presets are loaded through.
     */
    configureServer(server) {
      state.server = server;
    },

    /**
     * Starts the compiler before anything is served or bundled.
     */
    async buildStart() {
      await ready(state, resolved);
    },

    /**
     * Answers the stylesheet an application imports, and every font package its themes named.
     */
    resolveId(id) {
      const held = bare(id);

      if (held === resolved.stylesheet || held === VIRTUAL) return id.replace(held, VIRTUAL);

      return state.assembled?.fonts.get(held) ?? null;
    },

    /**
     * Renders the stylesheet: the faces the themes named, then the cascade order.
     */
    load(id) {
      return bare(id) === VIRTUAL ? renderStylesheet(resolved.layers, faces(state)) : null;
    },

    /**
     * Appends the compiled rules to a stylesheet that declares the cascade order.
     */
    async transform(code, id) {
      if (extname(bare(id)) !== ".css" || !declared.test(code)) return null;

      state.sheets.add(id);

      return { code: appended(state, await ready(state, resolved), this, code), map: null };
    },

    /**
     * Applies a change under a build that watches, where no hot update runs.
     *
     * @remarks
     *   A dev server reports the same change to `hotUpdate`, which applies it and invalidates the
     *   stylesheets, so under a server this hook leaves the change to that one.
     */
    async watchChange(id, change) {
      if (this.environment.config.command !== "build") return;

      await applied(state, resolved, id, change.event);
    },

    /**
     * Applies a change under a dev server, and invalidates every stylesheet the rules were
     * appended to when the compiler changed.
     */
    async hotUpdate(context) {
      const changed = await applied(state, resolved, context.file, context.type);

      return changed
        ? [...new Set([...invalidated(this.environment, state.sheets), ...context.modules])]
        : context.modules;
    },
  };
}
