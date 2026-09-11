/**
 * Pinning a dev server to a port, and meaning it.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Serves an app at a port, and refuses to start rather than move off it.
 *
 * Which port an app takes is the app's own knowledge — two apps in one workspace cannot share one,
 * and nothing here can tell which should have it.
 *
 * Strictness comes with the port rather than being asked for apart from it, because pinning a port
 * and then silently leaving it is incoherent. Vite's default takes the next port up when the stated
 * one is busy, which leaves the server you started and the URL you open two different processes: an
 * OAuth redirect URI or an end-to-end base URL written against the stated port then reaches
 * whatever else is already listening.
 *
 * Only the dev server is pinned. A preview server reads its own strictness from this one, so it
 * refuses to move as well, but keeps its own port — which is what lets an app be previewed while it
 * is also being served.
 *
 * A port a person opens while working, and nothing a deployment sees. What serves a build in
 * production serves static files on whatever port it already answers on, and neither of these
 * commands runs there at all.
 *
 * @param at - The port to serve at.
 * @returns The preset.
 */
export function port(at: number): Preset {
  return preset({
    config: { server: { port: at, strictPort: true } },
    name: `server.port(${at})`,
  });
}
