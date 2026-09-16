/**
 * Decides how a browser is told about the modules a chunk will go on to request.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Emits the preload links but leaves out the polyfill that backs them.
 *
 * @remarks
 *   The polyfill is an inline script the document has to run before anything else, and dropping it
 *   assumes every targeted browser implements `modulepreload` itself. One that does not still
 *   loads the application, a round trip slower per chunk.
 */
export function preload(): Preset {
  return preset({
    config: { build: { modulePreload: { polyfill: false } } },
    name: "build.preload",
  });
}
