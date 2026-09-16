/**
 * Publishes the contract check a config, plugin or library package runs against itself.
 *
 * @remarks
 *   A breach is reported as a sentence naming the check, the thing and the expectation, so a
 *   specification asserting on an empty array says what broke without anyone reaching for a
 *   debugger. The package under check is read from the directory a caller names and imported by
 *   the specification, never resolved from its published name.
 * @packageDocumentation
 */

export { type Check, type Conformance, violations } from "#conformance.ts";
export { type Found, isLayer, type Layer, type LayerKind, layersOf } from "#layers.ts";
export {
  type Engines,
  type Kind,
  type PublishConfig,
  type Published,
  publishedOf,
  type Target,
} from "#manifest.ts";
export { type Arguments, type Factory, prefixOf, type Walked, walked } from "#module.ts";
export { type Tiers } from "#tier.ts";
