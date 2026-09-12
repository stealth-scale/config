/**
 * Configuring a library that renders.
 */

import { configuring, type Defining, type Layer, owned } from "@stealthscale/vite-config";
import { layers as library } from "@stealthscale/vite-config/preset/web";

import * as plugin from "#plugin/index.ts";
import * as test from "#test/index.ts";

/**
 * The layers a library that renders states in its own config.
 *
 * What compiles its JSX, and what tears a rendered component down between tests. Nothing about a
 * page: a library has none, and a tier that laid one out would leave a package rooted at a
 * directory it does not have. An application reads `preset/app`, which is these plus the page.
 *
 * The plugin is here even though the packer transforms JSX on its own, because the tests do not go
 * through the packer. A component specified without it is compiled by a different transform from
 * the one the application that installs this library will use, which is the kind of difference that
 * shows up only in the application.
 *
 * @returns Each layer React needs beyond what a browser library already gets.
 */
export function layers(): readonly Layer[] {
  return owned("react", [plugin.refresh(), test.cleanup(), test.document()]);
}

/**
 * Composes a config for a library that renders.
 *
 * The library tier comes first and this package's layers after it, so what is stated here wins and
 * a repository's own keys win over both. Composed rather than left for a repository to pair up: two
 * imports that have to agree is two chances to reach for the wrong tier, and a repository doing so
 * would lose the browser's rules with nothing to say it had.
 */
export const defineConfig: Defining = configuring(() => [...library(), ...layers()]);
