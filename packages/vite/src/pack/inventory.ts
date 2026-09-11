/**
 * The bill of materials a package publishes beside itself.
 */

import sbom from "rollup-plugin-sbom";

import {
  contribute,
  type Contribution,
  inventory as described,
  type Supplier,
} from "@stealthscale/config-core";

/**
 * Writes down what the package was built out of.
 *
 * The same answer a built application writes, for the same reason and to a different audience. A
 * published package is read by whoever installs it, and what they get is a `dist` that inlined
 * whatever the packer decided to inline — so the manifest's dependency list describes what is left
 * over rather than what is in there.
 *
 * It ships because `files` names `dist` and this is written into it. That is the point: a consumer
 * scanning what they installed finds it without asking anybody, which is the difference between an
 * inventory and a report somebody has to request.
 *
 * No copy goes to `.well-known`. That is a path on a server, and nothing serves a tarball.
 *
 * A production pack says which build wrote it and when, and a development one does not. Which of
 * the two this is Vite has already decided, so the item is answered from what the layer is handed
 * rather than settled when the layer is written.
 *
 * @param supplier - Who supplied it. The house unless a repository says otherwise.
 * @returns The contribution the packer writes the inventory from.
 */
export function inventory(supplier?: Supplier): Contribution {
  return contribute({
    at: "pack.plugins",
    because: "what a packer inlines is no longer named by the manifest that declared it",
    itemOf: (context) =>
      sbom(
        described({
          identified: context.mode === "production",
          served: false,
          supplier,
          type: "library",
        }),
      ),
    name: "pack.inventory",
  });
}
