/**
 * Pinning the server that serves a build to a port, and meaning it.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Serves a build at a port, and refuses to start rather than move off it.
 *
 * Its own port rather than the dev server's, so an application can be previewed while it is also
 * being served — which is the only way to compare what a change did to the built output against
 * what it did to the one being worked on.
 *
 * Strict for the same reason the dev server is: a preview that quietly moves leaves whatever was
 * pointed at the stated port reaching a different process.
 *
 * @param at - The port to serve the build at.
 * @returns The preset.
 */
export function port(at: number): Preset {
  return preset({
    config: { preview: { port: at, strictPort: true } },
    name: `preview.port(${at})`,
  });
}
