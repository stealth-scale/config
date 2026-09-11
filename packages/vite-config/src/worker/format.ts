/**
 * What a worker is bundled as.
 */

import { type Preset, preset } from "@stealthscale/config-core";

/**
 * Bundles a worker as a module rather than as one self-contained script.
 *
 * The bundler's own answer is `iife`, which wraps the worker in a function call and inlines
 * everything it reaches, because a classic worker cannot import at all. That was the only portable
 * answer while Firefox had no module workers, and what it costs is the option of sharing: code the
 * worker and the page both reach has to be copied into the worker, however large it is and however
 * certainly the page already has it.
 *
 * A module worker imports, so the bundler may split what they share into a chunk both load. Whether
 * it does is its own decision — a few lines are cheaper inlined than fetched — so what this buys is
 * the choice rather than a smaller bundle in every case.
 *
 * Every browser the build targets supports one, which is the same reason `build.preload` stops
 * shipping its polyfill. The portable answer is now the one with a cost and no remaining benefit.
 *
 * Started with `new Worker(url, { type: "module" })`. A worker started without that type is a
 * classic worker whatever this says, and fails on its first import.
 *
 * @returns The preset.
 */
export function format(): Preset {
  return preset({ config: { worker: { format: "es" } }, name: "worker.format" });
}
