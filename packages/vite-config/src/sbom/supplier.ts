/**
 * Who supplied what a build produced.
 */

import { type Supplier } from "@stealthscale/vite-plugin-sbom";

/**
 * The organisation this house publishes under.
 *
 * The registered name rather than the npm scope. A bill of materials is read by whoever has to act
 * on it, and what they need is the entity that can be written to — which is the one on the
 * companies register, not the one in a package name.
 *
 * An inventory of what a package is made of answers one question — what is in here — and raises the
 * next, which is who to tell. A document naming no supplier is a list of components whose reporter
 * has to be worked out from a registry page, and the moment that matters is the moment somebody is
 * trying to report something.
 *
 * No contact is listed. What goes here is published in every tarball and served from every
 * deployment, so it is a decision about a person's address rather than about a build, and a
 * repository that has one to publish states its own supplier instead.
 */
export const HOUSE: Supplier = {
  name: "Stealth Scale B.V.",
  url: ["https://stealthscale.io"],
};
