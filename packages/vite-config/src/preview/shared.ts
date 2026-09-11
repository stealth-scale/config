/**
 * Letting another origin fetch what a preview serves.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { origins as allowed } from "#serving/environment.ts";

/**
 * Lets the named origins fetch what this preview serves.
 *
 * A preview answers its own origin and refuses the rest, which is right for an application somebody
 * opens and wrong for one another application loads. A host fetching a second application's entry
 * is a cross-origin request for a script, and the browser refuses it unless the server serving it
 * says otherwise.
 *
 * The origins are named rather than opened to everything. A preview serves a build of the real
 * thing, so whatever is true of it is about to be true in production, and `*` is not a thing to
 * discover there.
 *
 * @param origins - The origins allowed to fetch, each as a scheme and authority. What the
 *   repository knows, which `STEALTH_ORIGINS` overrides where a machine needs its own.
 * @returns The preset.
 */
export function shared(origins: readonly string[] = []): Preset {
  return preset({
    config: (context) => ({ preview: { cors: { origin: [...allowed(context, origins)] } } }),
    name: "preview.shared",
  });
}
