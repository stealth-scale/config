/**
 * How a stealth package is packed.
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
 * What every published package is packed with, wherever it runs.
 *
 * The entry list is among them. Every package that publishes states its subpaths in its manifest
 * already, so reading them here is what stops each config repeating the answer.
 *
 * @returns The layers.
 */
export function base(): readonly Layer[] {
  return [carry(), declarations(), inventory(), published(), quality(), source()];
}

/**
 * What a package the console runs is packed with.
 *
 * The same as the base. The packer already targets node by default and reads the engine the
 * manifest declares, so a tier that said so again would only be a second place to change it.
 *
 * @returns The layers.
 */
export function node(): readonly Layer[] {
  return base();
}

/**
 * What a library the browser runs is packed with.
 *
 * Built for no runtime in particular rather than for a browser. A published library is imported
 * wherever whoever installed it imports it, and a component library is rendered on a server as
 * often as in a page — the example in this repository renders one with `react-dom/server`. Naming
 * the browser would resolve every dependency through its `browser` field, which is the wrong answer
 * for half of those.
 *
 * What that leaves is the export map, which is what a package is meant to be read through and the
 * one answer that holds in both places. A library that really does reach for a browser and nothing
 * else says so with `pack.platform`.
 *
 * @returns The layers, built for no runtime in particular.
 */
export function web(): readonly Layer[] {
  return [...base(), platform("neutral")];
}
