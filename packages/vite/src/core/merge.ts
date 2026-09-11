/**
 * Merging one layer's config into what the layers before it built, remembering who wrote what.
 *
 * The merge itself is vite-plus's own, because its rules are already specified and already carry
 * years of edge cases. What is added here is the record: which layer decided each value, kept as
 * the value is decided rather than reconstructed afterwards, when it cannot be.
 */

import { mergeConfig, type UserConfig } from "vite-plus";

import { type Layer } from "#core/layer.ts";
import { type Source, wrote } from "#core/provenance.ts";

/**
 * Holds a config part-composed, and everything known about how it got that way.
 */
export interface Composed {
  /**
   * The config so far.
   */
  config: UserConfig;

  /**
   * One entry per value decided, in the order the layers decided them.
   */
  sources: readonly Source[];
}

/**
 * Nothing composed yet.
 */
export const NOTHING: Composed = { config: {}, sources: [] };

/**
 * Merges one layer's config in, and records what it decided.
 *
 * @param into - The config the layers before it built.
 * @param from - The config this layer sets.
 * @param layer - The layer, for the record.
 * @returns The config with this layer merged in, and the record extended.
 */
export function merged(into: Composed, from: UserConfig, layer: Layer): Composed {
  const config: UserConfig = mergeConfig(into.config, from);

  return { config, sources: [...into.sources, ...wrote(into.config, config, layer)] };
}

/**
 * Replaces the config wholesale, and records what changed.
 *
 * What an override does: it is handed the merged config and answers another, so there is nothing to
 * merge and the record is the difference between the two.
 *
 * @param into - The config the layers before it built.
 * @param config - The config the layer answered.
 * @param layer - The layer, for the record.
 * @returns The new config, and the record extended.
 */
export function replaced(into: Composed, config: UserConfig, layer: Layer): Composed {
  return { config, sources: [...into.sources, ...wrote(into.config, config, layer)] };
}
