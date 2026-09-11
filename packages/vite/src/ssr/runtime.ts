/**
 * What the server build is built to run on.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Builds the server bundle for a worker runtime rather than for node.
 *
 * The builder targets node, which reads a package's `node` condition and ignores its `browser`
 * field. An edge runtime is neither: it has no node built-ins to fall back on, and a package that
 * ships a browser build is usually offering the one that will work there.
 *
 * Asked for rather than assumed, because where a server runs is a deployment's decision and nothing
 * in a repository says which. Left alone the build targets node, which is where a server run from a
 * console runs.
 *
 * @returns The preset.
 */
export function runtime(): Preset {
  return preset({ config: { ssr: { target: "webworker" } }, name: "ssr.runtime(webworker)" });
}
