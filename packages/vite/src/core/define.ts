/**
 * What a repository's own `vite.config.ts` calls.
 */

import {
  type ConfigEnv,
  defineConfig as defineViteConfig,
  mergeConfig,
  type UserConfig,
  type UserConfigExport,
} from "vite-plus";

import { resolved } from "#core/compose.ts";
import { type Extendable } from "#core/layer.ts";

/**
 * Describes a repository's config: everything Vite+ takes, and the layers underneath it.
 */
export interface Config extends UserConfig {
  /**
   * The layers this repository is built on, composed in the order written.
   *
   * What is written beside `extends` wins over anything in it. That is the one rule between the
   * two, and it is the one `tsconfig.json` and the old eslintrc already taught everybody: what you
   * extend composes, what you write yourself decides.
   */
  extends?: readonly Extendable[] | undefined;
}

/**
 * Answers a config for the environment it is read in.
 */
export type ConfigFn = (env: ConfigEnv) => Config | Promise<Config>;

/**
 * Composes a repository's config out of layers.
 *
 * Given a function, it is called with the environment, which is how a config says something true
 * only of a dev server or only of a build. A layer that merely takes part sometimes says so with
 * its own `apply` instead, which keeps the shared layers out of both arms of an `if`.
 *
 * @param config - The config, or a function answering one.
 * @returns The composed config, for Vite+ to read.
 */
export function defineConfig(config: Config | ConfigFn | Promise<Config>): UserConfigExport {
  return defineViteConfig(async (env: ConfigEnv): Promise<UserConfig> => {
    const { extends: extended = [], ...own } = await (typeof config === "function"
      ? config(env)
      : config);

    const composed = await resolved(extended, env);

    return mergeConfig(composed.config, own) as UserConfig;
  });
}
