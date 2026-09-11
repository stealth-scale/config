/**
 * Configuring an application that renders.
 */

import { configuring, type Defining, type Layer, layout, owned } from "@stealthscale/vite-config";
import { layers as application } from "@stealthscale/vite-config/preset/app";

import * as plugin from "#plugin/index.ts";
import { PAGE } from "#preset/page.ts";
import * as test from "#test/index.ts";

/**
 * The layers an application that renders states in its own config.
 *
 * These are the ones an application's config is read for: where its page sits, and what compiles
 * its JSX. A library gets the second and not the first, which is the whole of the difference
 * between this tier and `preset/web`.
 *
 * @returns Each layer React needs beyond what a browser application already gets.
 */
export function layers(): readonly Layer[] {
  return owned("react", [layout.page(PAGE), plugin.refresh(), test.cleanup()]);
}

/**
 * Composes a config for an application that renders.
 *
 * The application tier comes first and this package's layers after it, so what is stated here wins
 * and a repository's own keys win over both. Composed rather than left for a repository to pair up:
 * two imports that have to agree is two chances to reach for the wrong tier, and a repository doing
 * so would lose the browser's rules with nothing to say it had.
 */
export const defineConfig: Defining = configuring(() => [...application(), ...layers()]);
