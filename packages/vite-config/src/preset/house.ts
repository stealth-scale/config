/**
 * Gathers the layers every tier shares, whatever the package turns out to be.
 */

import { type Extendable } from "@stealthscale/vite-config-core";

import * as fmt from "#fmt/index.ts";
import * as resolve from "#resolve/index.ts";

/**
 * Lists the formatting and resolution layers common to every tier.
 *
 * @remarks
 *   Nothing here answers what a package is or where it runs. A layer that would
 *   answer either belongs to a tier instead, and that restraint is what makes
 *   this list safe to spread into all of them without a tier having to undo
 *   anything.
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
