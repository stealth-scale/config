/**
 * Generates the runtime the design-system package publishes, from the preset it publishes.
 *
 * @remarks
 *   Exactly one package in a workspace does this. The runtime carries the tokens as types, so a
 *   second copy would be a second vocabulary, and a component would be bound to whichever one it
 *   imported.
 */

import { join } from "node:path";
import { type Plugin } from "vite";

import { imported, type Loading, writeIfChanged } from "@stealthscale/vite-plugin-base";

import { basePreset, generateRuntime } from "#compiler.ts";
import { renderRuntimeConfig } from "#config.ts";
import { CACHE, GENERATED, resolveOptions, type RuntimeOptions } from "#options.ts";
import { presetEntry } from "#statement.ts";

/**
 * Fixes the file the rendered configuration is written to, under the cache directory.
 */
const CONFIG = "runtime.config.mjs";

/**
 * The module the package's preset turns out to be once imported.
 */
interface Module {
  /**
   * The preset, or nothing where the module exports no default.
   */
  default?: object | undefined;
}

/**
 * Builds the plugin that generates the design-system package's runtime and regenerates it when
 * the preset changes.
 *
 * @remarks
 *   The runtime is generated as soon as the package's root is known rather than at the start of a
 *   build, because the package's own source imports what this writes: a type checker, a packer
 *   and a test runner all resolve those imports without starting a build. A file whose content
 *   did not change is left as it was, so a regeneration wakes the watcher for the files a change
 *   reached and no others.
 */
export function runtime(options: RuntimeOptions = {}): Plugin {
  const resolved = resolveOptions(options);
  let loading: Loading = { root: process.cwd() };
  let watching: readonly string[] = [];

  /**
   * Loads the package's own preset, renders the configuration, and runs codegen into the generated
   * directory.
   *
   * @throws {@link Error} When the package publishes no preset under `./theme`, or the preset
   *   exports no default.
   */
  async function generate(): Promise<void> {
    const entry = presetEntry(loading.root, loading.conditions ?? []);

    if (entry === undefined) throw new Error(`${loading.root} publishes no preset under ./theme`);

    const { files, module } = await imported<Module>(entry, loading);

    if (module.default === undefined) throw new Error(`${entry} exports no default`);

    const configPath = join(loading.root, CACHE, CONFIG);

    writeIfChanged(
      configPath,
      renderRuntimeConfig({
        base: basePreset(),
        foundation: module.default,
        layers: resolved.layers,
      }),
    );

    const compiler = await generateRuntime(loading.root, configPath, join(loading.root, GENERATED));

    watching = [...new Set([...files, ...compiler.dependencies])];
  }

  return {
    name: "stealth:theme.runtime",

    /**
     * Records where the package is and under which conditions it resolves, and generates.
     */
    async configResolved(config) {
      loading = { conditions: config.ssr.resolve?.conditions, root: config.root };
      await generate();
    },

    /**
     * Watches every file the preset was loaded from, so a token added there reaches the runtime.
     */
    buildStart() {
      for (const file of watching) this.addWatchFile(file);
    },

    /**
     * Regenerates when a file behind the preset changes, and leaves any other change to Vite.
     */
    async hotUpdate(context) {
      if (!watching.includes(context.file)) return context.modules;

      await generate();

      return context.modules;
    },
  };
}
