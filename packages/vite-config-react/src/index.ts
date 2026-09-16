/**
 * What a stealth package that renders is built, checked and formatted by.
 *
 * Every layer here is one the toolchain cannot state on its own behalf, because stating it would
 * mean naming React, and a configuration that names one framework is one no other framework can be
 * added beside. A package extends a tier from `@stealthscale/vite-config` and adds `layers()`
 * beside it. A workspace root adds `workspace()`.
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
