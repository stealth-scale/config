/**
 * The bill of materials a package publishes beside itself.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";
import { sbom, type Supplier } from "@stealthscale/vite-plugin-sbom";

import { HOUSE } from "#sbom/supplier.ts";

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
 * One path only. The other is `.well-known/sbom`, which is where a scanner looks on a running
 * deployment, and nothing serves a tarball.
 *
 * A release says which build wrote it and when; a development pack says neither, so two runs of one
 * commit are the same file.
 *
 * @param supplier - Who supplied it. The house unless a repository says otherwise.
 * @returns The contribution the packer writes the inventory from.
 */
export function inventory(supplier: Supplier = HOUSE): Contribution {
  return contribute({
    apply: "build",
    at: "pack.plugins",
    because: "what a packer inlines is no longer named by the manifest that declared it",
    itemOf: (context) =>
      sbom({
        serialNumber: context.mode === "production",
        supplier,
        timestamp: context.mode === "production",
        type: "library",
      }),
    name: "pack.inventory",
  });
}
