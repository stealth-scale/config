import { expect, test } from "vite-plus/test";

import { inventory } from "#sbom/inventory.ts";
import { HOUSE } from "#sbom/supplier.ts";

/**
 * A development build, which is what most of what follows does not turn on.
 */
const BUILT = { identified: false, served: true, type: "application" } as const;

test("describes what it was told it is describing", () => {
  expect(inventory({ ...BUILT, served: false, type: "library" })["rootComponentType"]).toBe(
    "library",
  );
  expect(inventory(BUILT)["rootComponentType"]).toBe("application");
});

test("says which build wrote it and when, where what is being built is a release", () => {
  const held = inventory({ ...BUILT, identified: true });

  expect(held["saveTimestamp"]).toBe(true);
  expect(held["generateSerial"]).toBe(true);
});

test("says neither otherwise, so two runs of one commit answer the same bytes", () => {
  expect(inventory(BUILT)["saveTimestamp"]).toBe(false);
  expect(inventory(BUILT)["generateSerial"]).toBe(false);
});

test("writes JSON alone, the other format needing another package to write at all", () => {
  expect(inventory(BUILT)["outFormats"]).toEqual(["json"]);
});

test("puts a copy where a scanner looks only when something serves it", () => {
  expect(inventory(BUILT)["includeWellKnown"]).toBe(true);
  expect(inventory({ ...BUILT, served: false, type: "library" })["includeWellKnown"]).toBe(false);
});

test("names the house as supplier, so a reader knows who to tell", () => {
  const held = inventory(BUILT)["supplier"] as { name: string };

  expect(held.name).toBe(HOUSE.name);
});

test("takes a repository's own supplier instead, where it has one", () => {
  const held = inventory({
    ...BUILT,
    supplier: { contact: [{ email: "a@b.test" }], name: "Acme", url: ["https://acme.test"] },
  })["supplier"] as { contact: unknown[]; name: string };

  expect(held.name).toBe("Acme");
  expect(held.contact).toHaveLength(1);
});

test("copies what it was given, so a caller's entity is not the plugin's", () => {
  const supplier = { contact: [], name: "Acme", url: ["https://acme.test"] };
  const held = inventory({ ...BUILT, supplier })["supplier"] as { url: string[] };

  expect(held.url).not.toBe(supplier.url);
});
