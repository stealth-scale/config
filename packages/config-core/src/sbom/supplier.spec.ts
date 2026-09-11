import { expect, test } from "vite-plus/test";

import { HOUSE } from "#sbom/supplier.ts";

test("names the registered entity, which is the one a reporter can write to", () => {
  expect(HOUSE.name).toBe("Stealth Scale B.V.");
});

test("says where to read about it, which is what a reporter follows", () => {
  expect(HOUSE.url).toContain("https://stealthscale.io");
});

test("publishes nobody's address, this being written into every tarball it ships in", () => {
  expect(HOUSE.contact).toEqual([]);
});
