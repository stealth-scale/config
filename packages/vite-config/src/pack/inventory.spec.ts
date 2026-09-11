import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";

import { type Context } from "@stealthscale/vite-config-core";

import { inventory } from "#pack/inventory.ts";
import { told } from "#vite.fixtures.ts";

/**
 * The hooks the plugin states, as this spec drives them.
 */
interface Writing {
  configResolved: (config: { root: string }) => void;
  generateBundle: (this: unknown) => void;
}

/**
 * Lays out a package for the plugin to describe.
 *
 * @returns Its directory.
 */
function described(): string {
  const at = mkdtempSync(join(tmpdir(), "stealth-pack-inventory-"));

  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "one", version: "1.0.0" }));

  return at;
}

/**
 * Runs the plugin over a build that reached nothing, and collects what it wrote.
 *
 * @param stated - Whatever differs from an ordinary package being packed.
 * @param supplier - Who supplied it, where the layer is not left to decide.
 * @returns Each document, by the path it was written to.
 */
function written(
  stated: Partial<Context> = {},
  supplier?: Parameters<typeof inventory>[0],
): Map<string, string> {
  const held = new Map<string, string>();
  const plugin = inventory(supplier).itemOf?.(told(stated)) as Writing;

  plugin.configResolved({ root: described() });
  plugin.generateBundle.call({
    emitFile: (file: { fileName: string; source: string }) => held.set(file.fileName, file.source),
    getModuleIds: () => [],
  });

  return held;
}

/**
 * Reads one document back.
 *
 * @param at - The path it was written to.
 * @param stated - Whatever differs from an ordinary package being packed.
 * @returns The document, parsed.
 */
function document(at: string, stated: Partial<Context> = {}): Record<string, unknown> {
  return JSON.parse(written(stated).get(at) ?? "{}") as Record<string, unknown>;
}

/**
 * Reads the document's metadata.
 *
 * @param stated - Whatever differs from an ordinary package being packed.
 * @returns What the document says about itself.
 */
function metadata(stated: Partial<Context> = {}): Record<string, unknown> {
  return document("cyclonedx/bom.json", stated)["metadata"] as Record<string, unknown>;
}

test("appends to the packer's plugins rather than replacing them", () => {
  expect(inventory().at).toBe("pack.plugins");
});

test("takes part in the build only, a dev server packing nothing", () => {
  expect(inventory().apply).toBe("build");
});

test("names itself, so a package publishing no inventory can take the layer back", () => {
  expect(inventory().name).toBe("pack.inventory");
});

test("writes one document, nothing serving a tarball the second path is for", () => {
  expect([...written().keys()]).toEqual(["cyclonedx/bom.json"]);
});

test("describes a library, which is what a tarball is", () => {
  expect((metadata()["component"] as Record<string, unknown>)["type"]).toBe("library");
});

test("supplies the house, so a report has somewhere to go without asking", () => {
  expect((metadata()["supplier"] as Record<string, unknown>)["name"]).toBe("Stealth Scale B.V.");
});

test("supplies whoever the repository names instead, where it names one", () => {
  const source = written({}, { name: "Acme", url: ["https://acme.example"] });
  const held = JSON.parse(source.get("cyclonedx/bom.json") ?? "{}") as Record<string, unknown>;
  const supplier = (held["metadata"] as Record<string, unknown>)["supplier"];

  expect((supplier as Record<string, unknown>)["name"]).toBe("Acme");
});

test("carries a serial number and a timestamp for a release", () => {
  const held = document("cyclonedx/bom.json", { mode: "production" });

  expect(held["serialNumber"]).toBeDefined();
  expect((held["metadata"] as Record<string, unknown>)["timestamp"]).toBeDefined();
});

test("carries neither in development, so two runs of one commit are the same file", () => {
  const held = document("cyclonedx/bom.json");

  expect(held["serialNumber"]).toBeUndefined();
  expect((held["metadata"] as Record<string, unknown>)["timestamp"]).toBeUndefined();
});
