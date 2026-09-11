import { expect, test } from "vite-plus/test";

import { HOUSE } from "#sbom/supplier.ts";

test("names the registered entity, which is the one that can be written to", () => {
  expect(HOUSE.name).toBe("Stealth Scale B.V.");
});

test("says where to read about it", () => {
  expect(HOUSE.url).toContain("https://stealthscale.io");
});
