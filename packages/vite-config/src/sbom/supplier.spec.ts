/**
 * Proves the house supplier carries the entity a generated SBOM has to name.
 */

import { describe, expect, it } from "vitest";

import { HOUSE } from "#sbom/supplier.ts";

describe("supplier", () => {
  it("names the registered entity", () => {
    expect(HOUSE.name).toBe("Stealth Scale B.V.");
  });

  it("gives the URL to read about it", () => {
    expect(HOUSE.url).toContain("https://stealthscale.io");
  });
});
