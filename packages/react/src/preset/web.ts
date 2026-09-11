/**
 * Configuring a package that renders in a browser.
 */

import { configuring, type Defining, type Layer, layout, owned } from "@stealthscale/config-vite";
import { layers as browser } from "@stealthscale/config-vite/preset/web";

import * as fmt from "#fmt/index.ts";
import * as lint from "#lint/index.ts";
import * as plugin from "#plugin/index.ts";
import { PAGE } from "#preset/page.ts";
import * as test from "#test/index.ts";

/**
 * The layers a workspace states once, at its root.
 *
 * The formatter and the linter are read from the root config and nowhere else, so these belong
 * there even though what they describe is a package two directories down. A workspace holding
 * anything that renders states this, and every file in it is then grouped and checked as React.
 *
 * What a root states about the runner is not here. Every workspace needs it, including one that
 * renders through something other than React, so it is the toolchain's `test.projects` rather than
 * this package's to hand out.
 *
 * @returns Each layer the root config needs on behalf of what renders below it.
 */
export function workspace(): readonly Layer[] {
  return owned("react", [fmt.imports(), lint.plugins(), lint.rules(), lint.runtime()]);
}

/**
 * The layers a package that renders states in its own config.
 *
 * These are the ones a package's config is read for: where its page sits, and what compiles its
 * JSX. Kept apart from {@link workspace} because a root config taking them would be rooted at a page
 * directory it does not have.
 *
 * @returns Each layer React needs beyond what a browser package already gets.
 */
export function layers(): readonly Layer[] {
  return owned("react", [layout.page(PAGE), plugin.refresh(), test.cleanup()]);
}

/**
 * Composes a config for a package that renders.
 *
 * The browser tier comes first and this package's layers after it, so what is stated here wins and
 * a repository's own keys win over both. Composed rather than left for a repository to pair up: two
 * imports that have to agree is two chances to reach for the wrong tier, and a repository doing so
 * would lose the browser's rules with nothing to say it had.
 */
export const defineConfig: Defining = configuring(() => [...browser(), ...layers()]);
