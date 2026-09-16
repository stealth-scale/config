/**
 * Imports a module through Vite, under the export conditions the application resolves with.
 *
 * @remarks
 *   A plugin that reads a workspace package at build time cannot import it through Node. Node takes
 *   the package's `default` condition, which names built output a fresh checkout has not produced.
 *   Vite takes the conditions the application states, and a running dev server holds a module
 *   graph the import joins, so an edit to any file behind the module reaches the plugin as a hot
 *   update.
 */

import {
  createRunnableDevEnvironment,
  isRunnableDevEnvironment,
  resolveConfig,
  type RunnableDevEnvironment,
  type ViteDevServer,
} from "vite";

/**
 * Fixes the name of the environment this module creates when no dev server is running.
 */
const NAME = "stealth";

/**
 * Describes where an import is resolved from, and under which conditions.
 */
export interface Loading {
  /**
   * The export conditions a resolution tries, in order. Vite's server conditions apply where
   * absent.
   */
  conditions?: readonly string[] | undefined;

  /**
   * The directory imports are resolved from.
   */
  root: string;
}

/**
 * Carries an imported module beside the files that were evaluated to produce it.
 */
export interface Imported<Module> {
  /**
   * Every file the module's evaluation read, its own first, as absolute paths. A module Vite
   * externalised is absent, because Node evaluated it and no file was read.
   */
  files: readonly string[];

  /**
   * The module's namespace.
   */
  module: Module;
}

/**
 * The evaluated modules a runner holds, named through the environment so no subpath is imported.
 */
type Evaluated = RunnableDevEnvironment["runner"]["evaluatedModules"];

/**
 * Collects the files behind an evaluated module, its own first, leaving out what was externalised.
 *
 * @remarks
 *   The walk follows the runner's own record of imports, so a file Vite transformed is listed and
 *   a package Node loaded is not. A module met through two importers is listed once.
 */
function filesOf(evaluated: Evaluated, id: string): string[] {
  const files: string[] = [];
  const seen = new Set<string>();
  const queue = [id];

  for (let held = queue.shift(); held !== undefined; held = queue.shift()) {
    if (seen.has(held)) continue;

    seen.add(held);

    const node = evaluated.getModuleById(held);

    if (node === undefined) continue;
    if (node.meta === undefined || !("externalize" in node.meta)) files.push(node.file);

    queue.push(...node.imports);
  }

  return files;
}

/**
 * Imports one module through an environment's runner, resolving the specifier first so the
 * runner's record can be read back under the resolved id.
 */
async function through<Module>(
  environment: RunnableDevEnvironment,
  id: string,
): Promise<Imported<Module>> {
  const resolved = await environment.pluginContainer.resolveId(id);
  const target = resolved?.id ?? id;
  const module = await environment.runner.import<Module>(target);

  return { files: filesOf(environment.runner.evaluatedModules, target), module };
}

/**
 * Builds a server environment of this module's own, rooted at the application and resolving under
 * its conditions.
 *
 * @remarks
 *   Nothing is externalised, so a workspace package resolves through Vite under the stated
 *   conditions rather than through Node under its `default` one. The environment reads no config
 *   file and no env file, so it runs the same wherever the plugin does.
 */
async function environmentFor(loading: Loading): Promise<RunnableDevEnvironment> {
  const config = await resolveConfig(
    {
      configFile: false,
      envDir: false,
      environments: {
        [NAME]: {
          consumer: "server",
          dev: { moduleRunnerTransform: true },
          resolve: {
            ...(loading.conditions === undefined ? {} : { conditions: [...loading.conditions] }),
            mainFields: [],
            noExternal: true,
          },
        },
      },
      logLevel: "silent",
      root: loading.root,
    },
    "serve",
  );
  const environment = createRunnableDevEnvironment(NAME, config, {
    hot: false,
    runnerOptions: { hmr: { logger: false } },
  });

  await environment.init();

  return environment;
}

/**
 * Imports a module through Vite and returns it with the files behind it.
 *
 * @remarks
 *   With a dev server whose `ssr` environment is runnable, the import goes through that runner and
 *   joins the server's module graph. Without one, an environment of this module's own is built,
 *   used for the one import, and closed.
 * @param id - A file path or a bare specifier, resolved from `loading.root`.
 * @throws {@link Error} When the specifier does not resolve or the module fails to evaluate.
 */
export async function imported<Module>(
  id: string,
  loading: Loading,
  server?: ViteDevServer,
): Promise<Imported<Module>> {
  const running = server?.environments["ssr"];

  if (running !== undefined && isRunnableDevEnvironment(running)) return through(running, id);

  const environment = await environmentFor(loading);

  try {
    return await through(environment, id);
  } finally {
    await environment.close();
  }
}
