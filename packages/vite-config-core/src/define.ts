/**
 * Adds `extends` to a Vite config and composes what it lists.
 *
 * @remarks
 *   This is the one entry a package's own `vite.config.ts` calls. The layers
 *   decide first and the keys written beside them decide last.
 */

import {
  type ConfigEnv,
  defineConfig as defineViteConfig,
  mergeConfig,
  type UserConfig,
  type UserConfigExport,
} from "vite";

import { resolved } from "#compose.ts";
import { type Context, contextOf } from "#context.ts";
import { type Extendable } from "#layer.ts";

/**
 * A Vite config with a list of layers to compose underneath it.
 */
export interface Config extends UserConfig {
  /**
   * The layers to compose. Nesting is allowed and flattened in reading order.
   */
  extends?: readonly Extendable[] | undefined;
}

/**
 * A config written as a function of what is being configured.
 *
 * @remarks
 *   The function runs once per invocation of the config, before any layer does,
 *   so the list it puts in `extends` can differ between a build and a serve.
 */
export type ConfigFn = (context: Context) => Config | Promise<Config>;

/**
 * Composes a package's layers and merges its own keys over the result.
 *
 * @remarks
 *   Every key written beside `extends` beats whatever a layer decided for it,
 *   and `extends` itself never reaches Vite. Each value is merged rather than
 *   replaced, so an array a caller writes is appended to the one the layers
 *   built.
 * @param at - The directory being configured, which `import.meta.dirname` is
 *   the only reliable way to name.
 * @param config - The caller's own config, or a function or promise returning
 *   one.
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
