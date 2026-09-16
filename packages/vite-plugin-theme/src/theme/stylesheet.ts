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
  type HotUpdateOptions,
  type Plugin,
  type ViteDevServer,
} from "vite";

import { type Loading } from "@stealthscale/vite-plugin-base";

import { cleaned } from "#compiler.ts";
import { reportDiagnostics } from "#diagnostics.ts";
import { renderStylesheet } from "#fonts.ts";
import { layerDeclaration, type Options, type Resolved, resolveOptions } from "#options.ts";
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
 * Carries everything the plugin holds between its hooks.
 */
interface Running {
  /**
   * The compiler and what it was assembled from, once assembled.
   */
  assembled?: Assembled | undefined;

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
 */
async function ready(state: Running, resolved: Resolved): Promise<Assembled> {
  state.assembled ??= await assemble(state.loading, resolved, state.server);

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
 * Compiles the rules, reports what the compiler found, and appends the rules to a stylesheet.
 *
 * @remarks
 *   An application whose graph names no package publishing a preset beside the system package
 *   compiles a stylesheet carrying the foundation's values and no component's rules, which is a
 *   blank-looking page and a build that succeeded, so that is reported here too.
 */
function appended(assembled: Assembled, context: Transforming, code: string): string {
  const { compiler, contributors, sources, watched } = assembled;
  const compiled = compiler.driver.cssgen({ emitLayerDeclaration: false });

  for (const file of [...watched, ...sources]) context.addWatchFile(file);

  const warn = context.warn.bind(context);

  reportDiagnostics(compiler.driver.designSystemDiagnostics, "the design system", warn);
  reportDiagnostics(compiled.diagnostics, "the stylesheet", warn);

  if (contributors.length === 1) {
    context.warn(
      "No package on this application's dependency graph publishes a preset under ./theme " +
        "beside the system package, so the stylesheet carries the foundation's values and no " +
        "component's rules.",
    );
  }

  return `${code}\n${cleaned(compiled.css)}`;
}

/**
 * Applies a changed file: a file behind the configuration restarts the compiler, a source file is
 * handed to the running compiler, and any other file is left to Vite.
 *
 * @returns The modules to reload, with every stylesheet the rules were appended to among them.
 */
async function refreshed(
  state: Running,
  resolved: Resolved,
  environment: DevEnvironment,
  context: HotUpdateOptions,
): Promise<EnvironmentModuleNode[]> {
  const assembled = state.assembled;

  if (assembled === undefined) return context.modules;

  if (assembled.watched.includes(context.file)) {
    state.assembled = undefined;
    await ready(state, resolved);
  } else if (assembled.compiler.driver.isSourceFile(context.file)) {
    assembled.compiler.driver.applyChange({
      content: await context.read(),
      kind: "change",
      path: context.file,
    });
  } else {
    return context.modules;
  }

  return [...new Set([...invalidated(environment, state.sheets), ...context.modules])];
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
  const declared = layerDeclaration(resolved.layers).slice(0, -1);
  const state: Running = { loading: { root: process.cwd() }, sheets: new Set() };

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
      if (extname(bare(id)) !== ".css" || !code.includes(declared)) return null;

      state.sheets.add(id);

      return { code: appended(await ready(state, resolved), this, code), map: null };
    },

    /**
     * Recompiles when a file behind the stylesheet changes, and leaves any other change to Vite.
     */
    hotUpdate(context) {
      return refreshed(state, resolved, this.environment, context);
    },
  };
}
