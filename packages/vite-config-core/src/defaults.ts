/**
 * Binds a set of default layers into a `defineConfig` a tier can publish.
 *
 * @remarks
 *   A tier exports the result rather than asking every package to spell out the
 *   same list. What a package extends is still its own, and sits above the
 *   defaults.
 */

import { type UserConfigExport } from "vite";

import { defineConfig as composed, type Config, type ConfigFn } from "#define.ts";
import { type Extendable } from "#layer.ts";

/**
 * The signature a tier's `defineConfig` presents to a package.
 *
 * @remarks
 *   The config argument is optional here, so a package taking the tier as it
 *   stands writes nothing but its own directory.
 */
export type Defining = (
  at: string,
  config?: Config | ConfigFn | Promise<Config>,
) => UserConfigExport;

/**
 * Builds a `defineConfig` that lays a tier's defaults beneath whatever a package extends.
 *
 * @remarks
 *   The defaults are read once per invocation rather than once per call, so a
 *   tier working its list out from the environment is asked again on every
 *   build. A package can take a default back by name with a removal, because
 *   the defaults come first and a removal only reaches what is above it.
 * @param defaults - Returns the layers every package on this tier starts from.
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
