import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";

import { type Bundling } from "#plugin.ts";
import { licensed, manifestAt, owning, reached, text } from "#reached.ts";

/**
 * Writes a package into a temporary `node_modules`, as a build would have found one.
 *
 * @param named - What the package is called.
 * @param manifest - What else its manifest holds.
 * @param licence - The licence file to write beside it, or nothing to write none.
 * @returns Where the package sits, and the module inside it.
 */
function packaged(
  named: string,
  manifest: Record<string, unknown> = {},
  licence?: string,
): { readonly at: string; readonly module: string } {
  const root = mkdtempSync(join(tmpdir(), "stealth-reached-"));
  const at = join(root, "node_modules", named);

  mkdirSync(at, { recursive: true });
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: named, ...manifest }));
  writeFileSync(join(at, "index.js"), "");

  if (licence !== undefined) writeFileSync(join(at, "LICENSE"), licence);

  return { at, module: join(at, "index.js") };
}

/**
 * Stands in for a build holding the given modules and imports.
 *
 * @param imports - Each module against what it imported.
 * @returns Something with the shape `reached` reads.
 */
function building(imports: Readonly<Record<string, readonly string[]>>): Bundling {
  return {
    getModuleIds: () => Object.keys(imports),
    getModuleInfo: (id: string) => ({ importedIds: imports[id] ?? [] }),
  } as unknown as Bundling;
}

test("reads a text field, and nothing where it is not text", () => {
  expect(text({ name: "held" }, "name")).toBe("held");
  expect(text({ name: 3 }, "name")).toBeUndefined();
});

test("finds the package a file belongs to by walking up to its manifest", () => {
  const held = packaged("one");

  expect(owning(held.module)).toBe(held.at);
});

test("answers nothing for a file with no manifest above it at all", () => {
  expect(owning("/nonexistent-3f9a/deeper/file.js")).toBeUndefined();
});

test("reads a manifest, and nothing where the directory holds none", () => {
  const held = packaged("one", { version: "1.2.3" });

  expect(manifestAt(held.at)?.["version"]).toBe("1.2.3");
  expect(manifestAt(join(held.at, "nowhere"))).toBeUndefined();
});

test("answers nothing where the manifest parses to something that is not an object", () => {
  const held = packaged("one");

  writeFileSync(join(held.at, "package.json"), "null");

  expect(manifestAt(held.at)).toBeUndefined();
});

test("reads one package once however many of its modules the build reached", () => {
  const one = packaged("one");

  writeFileSync(join(one.at, "second.js"), "");

  const second = join(one.at, "second.js");

  expect(reached(building({ [one.module]: [], [second]: [] })).size).toBe(1);
});

test("passes over an import from outside node_modules", () => {
  const one = packaged("one");
  const found = reached(building({ [one.module]: ["/repository/src/main.ts"] }));

  expect([...(found.get(one.at)?.dependsOn ?? [])]).toEqual([]);
});

test("answers nothing where the manifest does not parse", () => {
  const held = packaged("one");

  writeFileSync(join(held.at, "package.json"), "{ not json");

  expect(manifestAt(held.at)).toBeUndefined();
});

test("gathers every installed package the build reached", () => {
  const one = packaged("one");
  const other = packaged("other");

  expect(
    [...reached(building({ [one.module]: [], [other.module]: [] })).keys()].toSorted(),
  ).toEqual([one.at, other.at].toSorted());
});

test("passes over anything outside node_modules, which is the source being described", () => {
  expect(reached(building({ "/repository/src/main.ts": [] })).size).toBe(0);
});

test("passes over a package whose manifest names nothing", () => {
  const held = packaged("one");

  writeFileSync(join(held.at, "package.json"), JSON.stringify({ version: "1.0.0" }));

  expect(reached(building({ [held.module]: [] })).size).toBe(0);
});

test("records what one package imported from another", () => {
  const one = packaged("one");
  const other = packaged("other");
  const found = reached(building({ [one.module]: [other.module], [other.module]: [] }));

  expect([...(found.get(one.at)?.dependsOn ?? [])]).toEqual([other.at]);
});

test("does not record a package as importing itself", () => {
  const one = packaged("one");

  writeFileSync(join(one.at, "second.js"), "");

  const found = reached(building({ [one.module]: [join(one.at, "second.js")] }));

  expect([...(found.get(one.at)?.dependsOn ?? [])]).toEqual([]);
});

test("reads the licence text a package ships", () => {
  const held = packaged("one", {}, "MIT License\n\nPermission is hereby granted");

  expect(licensed(held.at)[0]?.named).toBe("LICENSE");
  expect(licensed(held.at)[0]?.text).toContain("Permission is hereby granted");
});

test("answers none where the package ships no licence text", () => {
  expect(licensed(packaged("one").at)).toEqual([]);
});

test("answers none where the directory cannot be read at all", () => {
  expect(licensed("/nonexistent-3f9a")).toEqual([]);
});

test("passes over a module under node_modules with no manifest above it", () => {
  const root = mkdtempSync(join(tmpdir(), "stealth-reached-"));
  const at = join(root, "node_modules");

  mkdirSync(at, { recursive: true });
  writeFileSync(join(at, "loose.js"), "");

  expect(reached(building({ [join(at, "loose.js")]: [] })).size).toBe(0);
});

test("reads a build that knows nothing about a module it listed", () => {
  const one = packaged("one");
  const bundling = {
    getModuleIds: () => [one.module],
    getModuleInfo: () => null,
  } as unknown as Bundling;

  expect(reached(bundling).size).toBe(1);
});

test("passes over an import made by something that is not an installed package", () => {
  const one = packaged("one");
  const held = reached(building({ "/repository/src/main.ts": [one.module] }));

  expect(held.size).toBe(1);
  expect([...(held.get(one.at)?.dependsOn ?? [])]).toEqual([]);
});

test("passes over a package whose manifest the build cannot read", () => {
  const one = packaged("one");

  writeFileSync(join(one.at, "package.json"), "{ not json");

  expect(reached(building({ [one.module]: [] })).size).toBe(0);
});
