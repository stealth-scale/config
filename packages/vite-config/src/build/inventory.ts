/**
 * The bill of materials an application ships beside itself.
 */

import { contribute, type Contribution } from "@stealthscale/config-core";
import { sbom, type Supplier } from "@stealthscale/plugin-sbom";

import { HOUSE } from "#sbom/supplier.ts";

/**
 * Where a scanner looks on a deployment that is already running.
 */
const SERVED = ".well-known/sbom";

/**
 * Where the document sits inside the output, which is where a reader of the build looks.
 */
const BESIDE = "cyclonedx/bom.json";

/**
 * Writes down what the application was built out of.
 *
 * A bundle is the one artefact where the question "what is in this" has no answer anybody can read:
 * every dependency has been inlined, renamed and minified into a file that names none of them. A
 * bill of materials is that answer, written by the thing that did the inlining and so the only
 * thing that knows.
 *
 * What it is for is the day after. A report names a package and a version; without an inventory,
 * working out whether a deployment contains it means rebuilding it from the commit it was built
 * from — assuming that is still known — and reading the lockfile. With one it is a lookup, and it
 * is a lookup anybody can do rather than only whoever can reproduce the build.
 *
 * Two copies. One beside the output for whoever has the artefact, and one at `.well-known/sbom`,
 * which is where a scanner looks on a deployment it can only reach over the network.
 *
 * @param supplier - Who supplied it. The house unless a repository says otherwise.
 * @returns The contribution the bundler writes the inventory from.
 */
export function inventory(supplier: Supplier = HOUSE): Contribution {
  return contribute({
    apply: "build",
    at: "plugins",
    because: "a bundle names none of what went into it, and somebody will need to ask",
    itemOf: (context) =>
      sbom({
        paths: [BESIDE, SERVED],
        serialNumber: context.mode === "production",
        supplier,
        timestamp: context.mode === "production",
        type: "application",
      }),
    name: "build.inventory",
  });
}
