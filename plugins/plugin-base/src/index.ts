/**
 * What a stealth bundler plugin is written with.
 *
 * A plugin here is a Vite plugin, and Vite's own `Plugin` extends rolldown's — so one written
 * against this runs under Vite, under rolldown, and under anything that takes a rollup-shaped
 * plugin. The peer is `vite` rather than the toolchain this repository happens to use, because a
 * plugin nobody outside can install is a plugin nobody outside can use.
 *
 * Two things, both of which every plugin here needed and each of which is easy to get subtly wrong:
 * a plugin whose hook reaches the build without anybody writing `this`, and the set of packages a
 * build actually reached.
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
