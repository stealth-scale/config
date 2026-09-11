import { expect, test } from "vite-plus/test";

import { inventory } from "#build/inventory.ts";

test("appends to the plugin list rather than replacing whatever else is there", () => {
  expect(inventory().at).toBe("plugins");
});

test("carries a plugin for the bundler to write the inventory from", () => {
  expect(inventory().item).toBeDefined();
});

test("says why, which is the thing a bundle cannot say about itself", () => {
  expect(inventory().because).toContain("names none of what went into it");
});

test("takes a repository's own supplier, where it has one to publish", () => {
  expect(inventory({ contact: [], name: "Acme", url: ["https://acme.test"] }).item).toBeDefined();
});

test("names itself, so a repository writing no inventory can take the layer back", () => {
  expect(inventory().name).toBe("build.inventory");
});
