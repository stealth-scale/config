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

import { resolved } from "#compose.ts";
import { type Context, contextOf } from "#context.ts";
import { type Extendable } from "#layer.ts";

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
 * Answers a config for what it is read in.
 */
export type ConfigFn = (context: Context) => Config | Promise<Config>;

/**
 * Composes a repository's config out of layers.
 *
 * Given a function, it is called with the context, which is how a config says something true only
 * of a dev server or only of a build. A layer that merely takes part sometimes says so with its own
 * `apply` instead, which keeps the shared layers out of both arms of an `if`.
 *
 * The directory is declared rather than discovered. Nothing a machine could work out on its own is
 * reliable here: the working directory is the workspace root under `vp test`, and the frame the
 * config runs in is a bundled temporary file outside the package altogether.
 *
 * @param at - Where this config is, as `import.meta.dirname`.
 * @param config - The config, or a function answering one.
 * @returns The composed config, for Vite+ to read.
 */
export function defineConfig(
  at: string,
  config: Config | ConfigFn | Promise<Config>,
): UserConfigExport {
  return defineViteConfig(async (env: ConfigEnv): Promise<UserConfig> => {
    const context = contextOf(env, at);
    const { extends: extended = [], ...own } = await (typeof config === "function"
      ? config(context)
      : config);

    const composed = await resolved(context, extended);

    return mergeConfig(composed, own) as UserConfig;
  });
}
