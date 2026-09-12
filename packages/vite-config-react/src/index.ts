/**
 * What a stealth package that renders is built, checked and formatted by.
 *
 * Every layer here is one the toolchain cannot state on its own behalf, because stating it would
 * mean naming React — and a configuration that names one framework is one no other framework can be
 * added beside. A repository reaches for the toolchain's web preset and extends it with these.
 *
 * @packageDocumentation
 */

export * as federation from "#federation/index.ts";
export * as fmt from "#fmt/index.ts";
export * as lint from "#lint/index.ts";
export * as plugin from "#plugin/index.ts";
export * as preset from "#preset/index.ts";
export * as test from "#test/index.ts";
