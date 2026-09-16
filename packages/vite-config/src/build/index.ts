/**
 * Collects the layers that configure a production build of an application.
 *
 * @remarks
 *   Every layer here concerns an artefact somebody downloads: how it is split, where it is served
 *   from, and what a reader can find out about it afterwards. What a library publishes is
 *   configured by the packer instead.
 */

export { base } from "#build/base.ts";
export { chunks } from "#build/chunks.ts";
export { inventory } from "#build/inventory.ts";
export { licences } from "#build/licences.ts";
export { manifest } from "#build/manifest.ts";
export { preload } from "#build/preload.ts";
export * as preset from "#build/preset.ts";
export { sourcemaps } from "#build/sourcemaps.ts";
