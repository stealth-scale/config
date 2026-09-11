import { expect, test } from "vite-plus/test";

import { inventory } from "#sbom/inventory.ts";
import { HOUSE } from "#sbom/supplier.ts";

test("describes what it was told it is describing", () => {
  expect(inventory({ served: false, type: "library" })["rootComponentType"]).toBe("library");
  expect(inventory({ served: true, type: "application" })["rootComponentType"]).toBe("application");
});

test("writes no timestamp, so two builds of one commit answer the same bytes", () => {
  expect(inventory({ served: true, type: "application" })["saveTimestamp"]).toBe(false);
});

test("writes no serial, which would differ per build for the same reason", () => {
  expect(inventory({ served: true, type: "application" })["generateSerial"]).toBe(false);
});

test("writes JSON alone, the other format needing another package to write at all", () => {
  expect(inventory({ served: true, type: "application" })["outFormats"]).toEqual(["json"]);
});

test("puts a copy where a scanner looks only when something serves it", () => {
  expect(inventory({ served: true, type: "application" })["includeWellKnown"]).toBe(true);
  expect(inventory({ served: false, type: "library" })["includeWellKnown"]).toBe(false);
});

test("names the house as supplier, so a reader knows who to tell", () => {
  const held = inventory({ served: true, type: "application" })["supplier"] as { name: string };

  expect(held.name).toBe(HOUSE.name);
});

test("takes a repository's own supplier instead, where it has one", () => {
  const held = inventory({
    served: true,
    supplier: { contact: [{ email: "a@b.test" }], name: "Acme", url: ["https://acme.test"] },
    type: "application",
  })["supplier"] as { contact: unknown[]; name: string };

  expect(held.name).toBe("Acme");
  expect(held.contact).toHaveLength(1);
});

test("copies what it was given, so a caller's entity is not the plugin's", () => {
  const supplier = { contact: [], name: "Acme", url: ["https://acme.test"] };
  const held = inventory({ served: true, supplier, type: "application" })["supplier"] as {
    url: string[];
  };

  expect(held.url).not.toBe(supplier.url);
});
