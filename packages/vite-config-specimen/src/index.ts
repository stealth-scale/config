/**
 * Configures an application that shows a catalogue of specimens, and the workspace root the
 * specimens sit under.
 *
 * @remarks
 *   Two entry points, because the bundler and the linter read different configurations. The
 *   application takes `layers()`, which adds the index plugin and the scan entries. The root takes
 *   `workspace()`, which relaxes the rules a specimen file is held to.
 * @packageDocumentation
 */

export { type Options } from "@stealthscale/vite-plugin-specimen";

export { crawled } from "#crawled.ts";
export { indexed } from "#indexed.ts";
export { layers } from "#layers.ts";
export { workspace } from "#workspace.ts";
