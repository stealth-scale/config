/**
 * What a stealth package's stylesheets are checked by.
 *
 * Stylelint runs as a plugin in the build rather than as a step of its own, because a stylesheet is
 * only reachable through the graph that imports it. A package extends a tier from
 * `@stealthscale/vite-config` and adds `layers()` beside it, and writes no stylelint configuration
 * of its own.
 *
 * What a stylesheet is held to is Google's HTML/CSS style guide, the same guide the TypeScript
 * rules follow. Most of it is the shared stylelint set. The selector and cascade refusals are
 * gathered here. The two rules about a leading zero and a quotation mark belong to the formatter,
 * which is where stylelint itself moved them.
 *
 * @packageDocumentation
 */

export { layers } from "#layers.ts";
export { type Checked } from "#plugin/check.ts";
export * as rules from "#rules/index.ts";
export { warn, type Warned } from "#warn.ts";
export { workspace } from "#workspace.ts";
