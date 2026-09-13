/**
 * The `build` block: what `vp build` writes, and what a reader of that output can work out.
 *
 * Read from the package's own config. A build acts on one application, and the workspace root has
 * none, so nothing here is shared the way the formatter and the linter are.
 *
 * A package that publishes rather than deploys is packed instead, and reads the `pack` block. The
 * two do not overlap: `build.sourcemap` is about an application's own output, and a published
 * package's maps are the packer's to decide.
 */

export { chunks } from "#build/chunks.ts";
export { inventory } from "#build/inventory.ts";
export { licences } from "#build/licences.ts";
export { manifest } from "#build/manifest.ts";
export { preload } from "#build/preload.ts";
export * as preset from "#build/preset.ts";
export { served } from "#build/served.ts";
export { sourcemaps } from "#build/sourcemaps.ts";
