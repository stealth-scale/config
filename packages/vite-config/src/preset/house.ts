/**
 * What every stealth package answers to, whatever it is and wherever it runs.
 */

import { type Extendable } from "@stealthscale/vite-config-core";

import * as fmt from "#fmt/index.ts";
import * as resolve from "#resolve/index.ts";

/**
 * The layers no tier decides, because none of them turn on what a package is.
 *
 * How a file is formatted and how a workspace package resolves to its own source are true of a
 * library, an application, a browser and a console alike. Stated once here so that a tier is the
 * difference between packages rather than a copy of what they share, and so that adding a tier
 * cannot quietly leave one of these out.
 *
 * @returns Each layer every tier is built on, in the order they compose.
 */
export function house(): readonly Extendable[] {
  return [
    fmt.docblocks(),
    fmt.imports(),
    fmt.generated(),
    fmt.prose(),
    fmt.style(),
    fmt.manifests(),
    resolve.source(),
  ];
}
