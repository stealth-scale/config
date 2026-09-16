/**
 * Publishes the stylesheet check a package adds beside the tier it extends,
 * which appends to Vite's plugin array and sets no other key.
 *
 * @packageDocumentation
 */

export { layers } from "#layers.ts";
export { type Checked } from "#plugin/check.ts";
export * as rules from "#rules/index.ts";
export { warn, type Warned } from "#warn.ts";
export { workspace } from "#workspace.ts";
