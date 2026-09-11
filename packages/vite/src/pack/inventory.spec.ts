import { expect, test } from "vite-plus/test";

import { inventory } from "#pack/inventory.ts";

test("appends to the packer's plugin list rather than replacing it", () => {
  expect(inventory().at).toBe("pack.plugins");
});

test("carries a plugin for the packer to write the inventory from", () => {
  expect(inventory().item).toBeDefined();
});

test("says why, which is what a manifest stops answering once a packer inlines", () => {
  expect(inventory().because).toContain("no longer named by the manifest");
});

test("takes a repository's own supplier, where it has one to publish", () => {
  expect(inventory({ contact: [], name: "Acme", url: ["https://acme.test"] }).item).toBeDefined();
});

test("names itself, so a repository publishing no inventory can take the layer back", () => {
  expect(inventory().name).toBe("pack.inventory");
});
