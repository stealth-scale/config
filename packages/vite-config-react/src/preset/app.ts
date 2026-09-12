/**
 * Configuring an application that renders.
 */

import { configuring, type Defining, type Layer, owned } from "@stealthscale/vite-config";
import { layers as application } from "@stealthscale/vite-config/preset/app";

import * as plugin from "#plugin/index.ts";
import * as test from "#test/index.ts";

/**
 * The layers an application that renders states in its own config.
 *
 * What compiles its JSX, and what tears a rendered component down between tests. The same as
 * `preset/web` states, because React asks the same of an application as of a library: the
 * difference between the two tiers is the one underneath, where an application is built and a
 * library is packed.
 *
 * Nothing about where the page sits. An application keeps its `index.html` where Vite looks for it,
 * beside the config, which is what makes one URL serve it in development and in a build.
 *
 * @returns Each layer React needs beyond what a browser application already gets.
 */
export function layers(): readonly Layer[] {
  return owned("react", [plugin.refresh(), test.cleanup(), test.document()]);
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
