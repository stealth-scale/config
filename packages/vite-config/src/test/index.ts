/**
 * The `test` block: what a package's tests are run under.
 *
 * Read from the package's own config, unlike `lint` and `fmt`, because the runner is started per
 * package and takes its root from the one it was started in.
 */

export { assertion } from "#test/assertion.ts";
export { type Browsed, browser, type Browser, type Viewport } from "#test/browser.ts";
export { coverage } from "#test/coverage.ts";
export { omit, type Omitted, prepare, type Prepared, thresholds } from "#test/departure.ts";
export { environment, type Environment } from "#test/environment.ts";
export { files } from "#test/files.ts";
export { isolation } from "#test/isolation.ts";
export { order } from "#test/order.ts";
export * as preset from "#test/preset.ts";
export { projects } from "#test/projects.ts";
