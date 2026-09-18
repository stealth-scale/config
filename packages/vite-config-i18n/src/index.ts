/**
 * Configures a package or an application that ships catalogues: the plugin that finds and types
 * them, and the setup file that puts the fallback language in scope for its specifications.
 *
 * @packageDocumentation
 */

export { type Options } from "@stealthscale/vite-plugin-i18n";

export { catalogued } from "#catalogued.ts";
export { layers } from "#layers.ts";
export { worded } from "#worded.ts";
