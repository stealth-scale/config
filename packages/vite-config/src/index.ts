/**
 * Composing a Vite+ config out of layers.
 *
 * A repository states what it is built on and what is true only of itself; everything else is a
 * layer some config package states on its behalf. Four kinds of layer, each minted by its own
 * function so that a bare object is never mistaken for one: a preset sets a block, a contribution
 * appends one item to a list, a removal takes one back, and an override rewrites what is left.
 *
 * What is published is what a config is written with, and what another config package builds layers
 * with. How layers merge and where a contribution finds its list are this package's own.
 *
 * @packageDocumentation
 */

export {
  type Apply,
  type Config,
  type ConfigFn,
  configuring,
  contribute,
  type Contribution,
  defineConfig,
  type Defining,
  type Extendable,
  type Layer,
  type Manifest,
  named,
  override,
  type Override,
  owned,
  type Preset,
  preset,
  type Removal,
  remove,
  type Stated,
} from "@stealthscale/vite-config-core";

export * as build from "#build/index.ts";
export * as define from "#define/index.ts";
export * as deps from "#deps/index.ts";
export * as federation from "#federation/index.ts";
export * as fmt from "#fmt/index.ts";
export * as lint from "#lint/index.ts";
export * as pack from "#pack/index.ts";
export * as preview from "#preview/index.ts";
export * as resolve from "#resolve/index.ts";
export * as run from "#run/index.ts";
export * as server from "#server/index.ts";
export * as serving from "#serving/index.ts";
export * as ssr from "#ssr/index.ts";
export * as staged from "#staged/index.ts";
export * as test from "#test/index.ts";
export * as worker from "#worker/index.ts";
