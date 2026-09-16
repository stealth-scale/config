/**
 * Binding a set of defaults to `defineConfig`, so a config states only what is true of itself.
 */

import { type UserConfigExport } from "vite";

import { defineConfig as composed, type Config, type ConfigFn } from "#define.ts";
import { type Extendable } from "#layer.ts";

/**
 * States a config for a package, with a tier's layers already under it.
 *
 * Takes the directory first, as everything handed a context does.
 *
 * Named rather than inferred so that a tier can annotate what it exports. A declaration file has to
 * be writable from one source file at a time, and an inferred type reaching into this module is
 * not.
 */
export type Defining = (
  at: string,
  config?: Config | ConfigFn | Promise<Config>,
) => UserConfigExport;

/**
 * Composes a config with a set of layers already under it.
 *
 * The defaults go beneath whatever the caller extends, so a repository's own layers are merged
 * after and win, and its top-level keys win over both.
 *
 * @param defaults - The layers every package taking this set is built on, nested to any depth.
 * @returns A `defineConfig` carrying them.
 */
export function configuring(defaults: () => readonly Extendable[]): Defining {
  return function defineConfig(
    at: string,
    config: Config | ConfigFn | Promise<Config> = {},
  ): UserConfigExport {
    return composed(at, async (context) => {
      const own = await (typeof config === "function" ? config(context) : config);

      return { ...own, extends: [...defaults(), ...(own.extends ?? [])] };
    });
  };
}
