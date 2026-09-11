import { expect, test } from "vite-plus/test";

import { inventory } from "#build/inventory.ts";
import { told } from "#serving/serving.fixtures.ts";

test("appends to the plugin list rather than replacing whatever else is there", () => {
  expect(inventory().at).toBe("plugins");
});

test("carries a plugin for the bundler to write the inventory from", () => {
  expect(inventory().itemOf?.(told())).toBeDefined();
});

test("says why, which is the thing a bundle cannot say about itself", () => {
  expect(inventory().because).toContain("names none of what went into it");
});

test("takes a repository's own supplier, where it has one to publish", () => {
  const held = inventory({ contact: [], name: "Acme", url: ["https://acme.test"] });

  expect(held.itemOf?.(told())).toBeDefined();
});

test("answers the plugin when it is resolved, the settings turning on what a release states", () => {
  expect(inventory().item).toBeUndefined();
});

test("names itself, so a repository writing no inventory can take the layer back", () => {
  expect(inventory().name).toBe("build.inventory");
});
