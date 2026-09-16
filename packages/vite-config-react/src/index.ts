/**
 * Supplies what a package that renders adds on top of a tier from `@stealthscale/vite-config`,
 * through {@link layers} in a package and {@link workspace} at the repository root.
 *
 * @packageDocumentation
 */

export * as federation from "#federation/index.ts";
export * as fmt from "#fmt/index.ts";
export { layers } from "#layers.ts";
export * as lint from "#lint/index.ts";
export * as plugin from "#plugin/index.ts";
export * as test from "#test/index.ts";
export { workspace } from "#workspace.ts";
