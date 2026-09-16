import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { type Context } from "@stealthscale/vite-config-core";

import { inventory } from "#build/inventory.ts";
import { told } from "#vite.fixtures.ts";

/**
 * The hooks the plugin states, as this spec drives them.
 */
interface Writing {
  configResolved: (config: { root: string }) => void;
  generateBundle: (this: unknown) => void;
}

/**
 * Lays out an application for the plugin to describe.
 *
 * @returns Its directory.
 */
function described(): string {
  const at = mkdtempSync(join(tmpdir(), "stealth-build-inventory-"));

  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "one", version: "1.0.0" }));

  return at;
}

/**
 * Runs the plugin over a build that reached nothing, and collects what it wrote.
 *
 * @param stated - Whatever differs from an ordinary application being built.
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
 * @param stated - Whatever differs from an ordinary application being built.
 * @returns The document, parsed.
 */
function document(at: string, stated: Partial<Context> = {}): Record<string, unknown> {
  return JSON.parse(written(stated).get(at) ?? "{}") as Record<string, unknown>;
}

/**
 * Reads the document's metadata.
 *
 * @param stated - Whatever differs from an ordinary application being built.
 * @returns What the document says about itself.
 */
function metadata(stated: Partial<Context> = {}): Record<string, unknown> {
  return document("cyclonedx/bom.json", stated)["metadata"] as Record<string, unknown>;
}

describe("inventory", () => {
  it("appends to the bundler's plugins rather than replacing them", () => {
    expect(inventory().at).toBe("plugins");
  });

  it("applies to the build and not to the dev server", () => {
    expect(inventory().apply).toBe("build");
  });

  it("names the layer so a repository can remove it", () => {
    expect(inventory().name).toBe("build.inventory");
  });

  it("writes one copy beside the output and one where a scanner reaches for it", () => {
    expect([...written().keys()].toSorted()).toStrictEqual([
      ".well-known/sbom",
      "cyclonedx/bom.json",
    ]);
  });

  it("writes the same document to both paths", () => {
    const held = written();

    expect(held.get(".well-known/sbom")).toBe(held.get("cyclonedx/bom.json"));
  });

  it("describes an application", () => {
    expect((metadata()["component"] as Record<string, unknown>)["type"]).toBe("application");
  });

  it("supplies the house", () => {
    expect((metadata()["supplier"] as Record<string, unknown>)["name"]).toBe("Stealth Scale B.V.");
  });

  it("supplies the author the repository names instead", () => {
    const source = written({}, { name: "Acme", url: ["https://acme.example"] });
    const held = JSON.parse(source.get("cyclonedx/bom.json") ?? "{}") as Record<string, unknown>;
    const supplier = (held["metadata"] as Record<string, unknown>)["supplier"];

    expect((supplier as Record<string, unknown>)["name"]).toBe("Acme");
  });

  it("includes a serial number and a timestamp for a release", () => {
    const held = document("cyclonedx/bom.json", { mode: "production" });

    expect(held["serialNumber"]).toBeDefined();
    expect((held["metadata"] as Record<string, unknown>)["timestamp"]).toBeDefined();
  });

  it("includes neither in development", () => {
    const held = document("cyclonedx/bom.json");

    expect(held["serialNumber"]).toBeUndefined();
    expect((held["metadata"] as Record<string, unknown>)["timestamp"]).toBeUndefined();
  });
});
