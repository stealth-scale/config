/**
 * What goes into the bill of materials a build writes beside its output.
 */

import { HOUSE, type Supplier } from "#sbom/supplier.ts";

/**
 * What the thing being described is: something installed, or something deployed.
 */
export type Kind = "application" | "library";

/**
 * The settings both blocks hand the plugin, whatever they are describing.
 *
 * `saveTimestamp` is off, and it is the one that matters beyond taste. A timestamp makes every
 * build write a file that differs from the last one by the moment it ran, which costs two things:
 * the task runner stops being able to tell a rebuilt package from an unchanged one, and two builds
 * of the same commit stop being comparable — which is the whole of what a reproducible build is
 * for. A serial number would do the same, and is off already.
 *
 * JSON and not XML. Both say the same thing and every tool reads the first; the second needs
 * another package installed to write it at all.
 */
const SHARED = {
  generateSerial: false,
  outFormats: ["json"] as const,
  saveTimestamp: false,
  specVersion: "1.7" as const,
};

/**
 * Describes a bill of materials.
 */
export interface Inventory {
  /**
   * Whether the output is served, which decides whether a copy goes where a browser looks for one.
   */
  served: boolean;

  /**
   * Who supplied it. The house unless a repository says otherwise.
   */
  supplier?: Supplier | undefined;

  /**
   * What is being described.
   */
  type: Kind;
}

/**
 * Builds the settings for one kind of output.
 *
 * `.well-known/sbom` is written for what is served and not for what is installed. It is a URL a
 * scanner fetches from a running deployment, so a copy of it inside a tarball is a file nobody can
 * reach under a name that promises they can.
 *
 * @param stated - The thing being described. `Inventory` documents every member.
 * @returns The settings, ready for the plugin.
 */
export function inventory(stated: Inventory): Record<string, unknown> {
  const supplier = stated.supplier ?? HOUSE;

  return {
    ...SHARED,
    includeWellKnown: stated.served,
    rootComponentType: stated.type,
    supplier: { contact: [...supplier.contact], name: supplier.name, url: [...supplier.url] },
  };
}
