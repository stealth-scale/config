/**
 * What a layer is, and how layers become one config.
 *
 * Four kinds, each minted by its own function so that a bare object is never mistaken for one: a
 * preset sets a block, a contribution appends one item to a list, a removal takes one back, and an
 * override rewrites what is left. Three passes turn a list of them into a config, and a record of
 * which layer decided each value is kept alongside it.
 *
 * Nothing here names a key of a Vite+ configuration or knows what a block is, and a module that
 * does either belongs in the package owning that block. Reading a file is not on that list: what is
 * being configured — a directory, a manifest, an environment — is the one thing every block would
 * otherwise have to work out for itself, so the kernel works it out once.
 *
 * @packageDocumentation
 */

export { type Context, contextOf, type Manifest } from "#context.ts";
export { configuring, type Defining } from "#defaults.ts";
export { type Config, type ConfigFn, defineConfig } from "#define.ts";
export {
  type Apply,
  contribute,
  type Contribution,
  type Extendable,
  type Layer,
  override,
  type Override,
  owned,
  type Preset,
  preset,
  type Removal,
  remove,
  type Stated,
} from "#layer.ts";
export { type Inventory, inventory, type Kind } from "#sbom/inventory.ts";
export { type Contact, HOUSE, type Supplier } from "#sbom/supplier.ts";
