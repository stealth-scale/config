/**
 * Groups the pack layers a library extends, one group per runtime it targets.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { carry } from "#pack/carry.ts";
import { declarations } from "#pack/declarations.ts";
import { inventory } from "#pack/inventory.ts";
import { platform } from "#pack/platform.ts";
import { published } from "#pack/published.ts";
import { quality } from "#pack/quality.ts";
import { source } from "#pack/source.ts";

/**
 * Gathers what holds for every published library, whatever it runs on.
 *
 * @remarks
 *   The group derives its entries from the manifest, so a package extending it states what it
 *   publishes in `package.json` and nowhere else.
 */
export function base(): readonly Layer[] {
  return [carry(), declarations(), inventory(), published(), quality(), source()];
}

/**
 * Takes the base group for a library that only ever runs on a server.
 *
 * @remarks
 *   The packer already resolves for node, so this adds nothing. A package calls it to say which
 *   runtime it targets, which stops the choice from being invisible when that changes.
 */
export function node(): readonly Layer[] {
  return base();
}

/**
 * Extends the base group for a library a browser has to be able to load.
 *
 * @remarks
 *   The runtime is fixed to neutral rather than to the browser, because a library reaching the
 *   browser is usually also imported by a server rendering it.
 */
export function web(): readonly Layer[] {
  return [...base(), platform("neutral")];
}
