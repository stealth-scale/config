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
 * JSON and not XML. Both say the same thing and every tool reads the first; the second needs
 * another package installed to write it at all.
 */
const SHARED = {
  collectLicenseEvidence: true,
  outFormats: ["json"] as const,
  specVersion: "1.7" as const,
};

/**
 * Describes a bill of materials.
 */
export interface Inventory {
  /**
   * Whether the document says which build wrote it and when.
   *
   * A serial number and a timestamp are what a scanner tracks one bill of materials by, and the
   * minimum elements a published inventory is expected to carry name a timestamp outright. They
   * also make every run write a file differing from the last by the moment it ran, so two builds of
   * one commit stop being comparable — which is the whole of what a reproducible build is for.
   *
   * Production gets the identity and development gets the reproducibility. A release is written
   * once and read by people who need to know which one they have; a build somebody runs forty times
   * an afternoon is one where a file changing on its own is noise. Vite already decides which of
   * the two this is, so nothing here reads it again.
   */
  identified: boolean;

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
    generateSerial: stated.identified,
    includeWellKnown: stated.served,
    rootComponentType: stated.type,
    saveTimestamp: stated.identified,
    supplier: { contact: [...supplier.contact], name: supplier.name, url: [...supplier.url] },
  };
}
