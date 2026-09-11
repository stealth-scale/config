/**
 * Forwarding one path to whatever is answering behind it.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Forwards every request under a path to the origin answering behind it.
 *
 * What an app talks to is the app's own knowledge, and one call states one route so that two
 * modules can each state theirs. Routes merge by path, so a later one replaces an earlier one
 * naming the same path and leaves the rest standing.
 *
 * A preview server reads its routes from the dev server's, so forwarding a path here forwards it in
 * both.
 *
 * @param path - The prefix every forwarded request starts with.
 * @param target - The origin to forward it to.
 * @returns The preset.
 */
export function proxy(path: string, target: string): Preset {
  return preset({
    config: { server: { proxy: { [path]: target } } },
    name: `server.proxy(${path})`,
  });
}
