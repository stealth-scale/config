/**
 * The bill of materials an application ships beside itself.
 */

import sbom from "rollup-plugin-sbom";

import { contribute, type Contribution } from "#core/layer.ts";
import { inventory as described } from "#sbom/inventory.ts";
import { type Supplier } from "#sbom/supplier.ts";

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
 * Written for every application rather than asked for, because the build that needs one is the
 * build nobody thought to ask about.
 *
 * A copy goes to `.well-known/sbom`, which is where a scanner looks on a deployment that is already
 * running.
 *
 * @param supplier - Who supplied it. The house unless a repository says otherwise.
 * @returns The contribution the bundler writes the inventory from.
 */
export function inventory(supplier?: Supplier): Contribution {
  return contribute({
    at: "plugins",
    because: "a bundle names none of what went into it, and somebody will need to ask",
    item: sbom(described({ served: true, supplier, type: "application" })),
    name: "build.inventory",
  });
}
