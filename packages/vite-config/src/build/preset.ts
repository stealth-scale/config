/**
 * Groups the build layers an application extends, one group per kind of target.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { chunks } from "#build/chunks.ts";
import { inventory } from "#build/inventory.ts";
import { licences } from "#build/licences.ts";
import { manifest } from "#build/manifest.ts";
import { preload } from "#build/preload.ts";
import { sourcemaps } from "#build/sourcemaps.ts";

/**
 * Gathers the little that holds for any build, browser or not.
 *
 * @remarks
 *   The group is thin because almost everything else in this directory only means something for an
 *   artefact a browser downloads over a network.
 */
export function base(): readonly Layer[] {
  return [sourcemaps()];
}

/**
 * Extends the base group for an application a browser downloads and runs.
 *
 * @remarks
 *   Splitting, preloading and the asset manifest all assume that target. A server-side build takes
 *   the base group and adds none of them.
 */
export function web(): readonly Layer[] {
  return [...base(), chunks(), inventory(), licences(), manifest(), preload()];
}
