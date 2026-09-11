/**
 * Configuring an application, which is deployed rather than published.
 */

import * as build from "#build/index.ts";
import { type Extendable } from "#core/layer.ts";
import * as lint from "#lint/index.ts";
import { configuring, type Defining } from "#preset/defaults.ts";
import { house } from "#preset/house.ts";
import * as test from "#test/index.ts";

/**
 * The layers an application a browser opens is built on.
 *
 * The other kind of package, and the axis the runtime tiers do not carry: a library is packed and
 * installed by something else, an application is built and served. Nothing here packs. An
 * application has no export map for the packer to write, no types for a consumer to resolve, and
 * nothing published for `publint` to read — so carrying those layers would only mean a config that
 * describes a command the package cannot run.
 *
 * A browser is assumed rather than asked for. A console program that is deployed rather than
 * published is rare, and a command-line tool — which is the common case — is installed from a
 * registry and belongs on `preset/node` with the rest of what publishes.
 *
 * Answered as a list as well as bound below, so that a config package for a framework composes
 * these with its own rather than sitting beside them. Sitting beside them is what lets a repository
 * pair the wrong tier with the right framework and lose half its rules without being told.
 *
 * @returns Each layer the tier is built on, in the order they compose.
 */
export function layers(): readonly Extendable[] {
  return [...house(), build.preset.web(), lint.preset.web(), test.preset.web()];
}

/**
 * Composes a config for an application a browser opens.
 */
export const defineConfig: Defining = configuring(layers);
