/**
 * Assembles the stylesheet compiler for an application: the statement, every contributor's preset,
 * the rendered configuration, the started compiler and the scanned sources.
 *
 * @remarks
 *   The scan happens once, when the compiler starts. A changed file is handed to the running
 *   compiler on its own afterwards, which is the incremental path the compiler offers.
 */

import { join } from "node:path";
import { type ViteDevServer } from "vite";

import { type Loading, resolvedOnGraph, writeIfChanged } from "@stealthscale/vite-plugin-base";

import { basePreset, type Compiler, startCompiler } from "#compiler.ts";
import { renderStylesheetConfig } from "#config.ts";
import { type Contributor, contributors, workspaceSources } from "#contributors.ts";
import { CACHE, type Resolved } from "#options.ts";
import { scopedPresets } from "#scope.ts";
import { type Application, fontPackages, loadPreset, loadStatement } from "#statement.ts";

/**
 * Fixes the file the rendered configuration is written to, under the cache directory.
 */
const CONFIG = "stylesheet.config.mjs";

/**
 * Fixes the file a package declares its dependencies in.
 */
const MANIFEST = "package.json";

/**
 * Carries everything one assembly produced.
 */
export interface Assembled {
  /**
   * The started compiler.
   */
  compiler: Compiler;

  /**
   * Every package contributing a preset, the system package first.
   */
  contributors: readonly Contributor[];

  /**
   * The file each font package the themes named resolved to, or undefined where nothing resolved
   * it.
   */
  fonts: ReadonlyMap<string, string | undefined>;

  /**
   * Every file the compiler scanned, which is what the bundler is asked to watch.
   */
  sources: readonly string[];

  /**
   * Every file the configuration was built from: the statement, the presets and the manifests.
   */
  watched: readonly string[];
}

/**
 * Turns what the application asked to compile outright into the compiler's rule.
 */
function staticCssOf(application: Application): Exclude<Application["static"], "*"> {
  return application.static === "*" ? { recipes: "*" } : application.static;
}

/**
 * Loads the statement and every contributor's preset, renders the configuration, starts the
 * compiler and scans everything the application draws with.
 *
 * @remarks
 *   The first theme's preset is installed unscoped, which is what makes it the theme that applies
 *   while no attribute is set, and every theme's preset is installed scoped, the first included.
 *   The manifests are watched beside the statement and the presets, because a package added to a
 *   manifest is a package whose own files nothing is watching yet, so the change that introduces
 *   it is the only notice there is.
 * @throws {@link Error} When the application does not depend on the system package, or the
 *   statement or a preset cannot be loaded.
 */
export async function assemble(
  loading: Loading,
  resolved: Resolved,
  server?: ViteDevServer,
): Promise<Assembled> {
  const { root } = loading;
  const statement = await loadStatement(loading, server);
  const found = contributors(root, resolved.systemPackage);
  const presets = await Promise.all(found.map((each) => loadPreset(each.name, loading, server)));
  const [foundation, ...rest] = presets;

  if (found[0]?.name !== resolved.systemPackage || foundation === undefined) {
    throw new Error(`${root} does not depend on ${resolved.systemPackage}`);
  }

  const { themes } = statement.application;
  const [first] = themes;
  const configPath = join(root, CACHE, CONFIG);

  writeIfChanged(
    configPath,
    renderStylesheetConfig({
      base: basePreset(),
      foundation: foundation.preset,
      include: [...new Set([...resolved.include, ...workspaceSources(root)])],
      layers: resolved.layers,
      presets: [
        ...rest.map((each) => each.preset),
        ...(first.preset === undefined ? [] : [first.preset]),
        ...scopedPresets(themes),
      ],
      staticCss: staticCssOf(statement.application),
      system: resolved.systemPackage,
      themes: Object.fromEntries(themes.map((each) => [each.name, each.variant])),
    }),
  );

  const compiler = await startCompiler(root, configPath);

  compiler.driver.parseFiles();

  return {
    compiler,
    contributors: found,
    fonts: new Map(
      fontPackages(statement.application).map((name) => [name, resolvedOnGraph(root, name)]),
    ),
    sources: compiler.driver.scan(),
    watched: [
      ...new Set([
        ...statement.files,
        ...presets.flatMap((each) => each.files),
        join(root, MANIFEST),
        ...found.map((each) => join(each.at, MANIFEST)),
        ...compiler.dependencies,
      ]),
    ],
  };
}
