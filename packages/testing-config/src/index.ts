/**
 * Reads a config or plugin package in a specification and lists what it breaks of the house
 * contract.
 *
 * A package promises its consumers what its manifest publishes, what its barrel exports, and what
 * its layers are called and carry. No unit specification reaches any of those. A package adds one
 * specification that asserts an empty list, and fails its own gate with the sentence that names
 * what drifted.
 *
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
