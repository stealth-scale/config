/**
 * How a package is built.
 */

import { type Layer } from "@stealthscale/config-core";

import { licences } from "#build/licences.ts";
import { manifest } from "#build/manifest.ts";
import { preload } from "#build/preload.ts";
import { sourcemaps } from "#build/sourcemaps.ts";

/**
 * What every build gets, wherever its output runs.
 *
 * Only the source maps, which are the one thing worth having about output nobody can read. The rest
 * of what a build decides is about a page, and a tier that says nothing about where it runs cannot
 * know there is one.
 *
 * @returns The layers.
 */
export function base(): readonly Layer[] {
  return [sourcemaps()];
}

/**
 * What a build whose output a browser runs gets.
 *
 * @returns The layers, with what only a page has.
 */
export function web(): readonly Layer[] {
  return [...base(), licences(), manifest(), preload()];
}
