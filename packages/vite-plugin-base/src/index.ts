/**
 * Publishes the base every bundler plugin in this repository is built on, which
 * runs under Vite, under rolldown, and under anything that accepts a
 * rollup-shaped plugin.
 *
 * @packageDocumentation
 */

export { type Bundling, type Plugin, plugin, type Stated } from "#plugin.ts";
export {
  licensed,
  type Licensed,
  type Manifest,
  manifestAt,
  owning,
  type Reached,
  reached,
  text,
} from "#reached.ts";
