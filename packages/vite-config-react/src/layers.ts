/**
 * What a package that renders states in its own config.
 */

import { type Layer } from "@stealthscale/vite-config";

import * as plugin from "#plugin/index.ts";
import * as test from "#test/index.ts";

/**
 * The layers a package that renders adds beside its tier.
 *
 * What compiles its JSX, what tears a rendered component down between tests, and the document
 * those tests draw into. The same three for a library and an application, because React asks the
 * same of both. The difference between the two is the tier underneath, where an application is
 * built and a library is packed.
 *
 * The plugin is here even though the packer transforms JSX on its own, because the tests do not go
 * through the packer. A component specified without it is compiled by a different transform from
 * the one the application that installs this library uses, which is the kind of difference that
 * shows up only in the application.
 *
 * @returns Each layer React needs beside a tier, in the order they compose.
 */
export function layers(): readonly Layer[] {
  return [plugin.refresh(), test.cleanup(), test.document()];
}
