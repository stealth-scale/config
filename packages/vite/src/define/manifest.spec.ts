import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type UserConfig } from "vite-plus";
import { afterAll, expect, test } from "vite-plus/test";

import { type Injected, manifest } from "#define/manifest.ts";

/**
 * The directories a specification wrote, removed once every one of them has run.
 */
const written: string[] = [];

afterAll(() => {
  for (const at of written) rmSync(at, { force: true, recursive: true });
});

/**
 * Writes a manifest into a directory of its own.
 *
 * @param stated - The manifest to write, or nothing to leave the directory empty.
 * @returns Where that directory sits.
 */
function packaged(stated?: Record<string, unknown>): string {
  const at = mkdtempSync(join(tmpdir(), "stealth-define-"));

  written.push(at);
  if (stated !== undefined) writeFileSync(join(at, "package.json"), JSON.stringify(stated));

  return at;
}

/**
 * Reads back the constants a config would be built with.
 *
 * @param at - The directory holding the manifest to read.
 * @param injected - What to ask for beyond the two always given.
 * @returns Each constant's name against the text it is replaced by.
 */
function definedBy(at: string, injected: Injected = {}): Record<string, string> {
  const { define: held } = manifest(at, injected).config as UserConfig;

  return held as Record<string, string>;
}

/**
 * The subpath a package reaches the declarations by.
 */
const SUBPATH = "./globals";

/**
 * Reads the constants the shipped declarations promise.
 *
 * @returns Every name `globals.d.ts` declares.
 */
function declared(): string[] {
  const source = readFileSync(new URL("../../globals.d.ts", import.meta.url).pathname, "utf8");

  return [...source.matchAll(/declare const (\S+):/gu)].map(([, name]) => name ?? "");
}

/**
 * Reads this package's own manifest.
 *
 * @returns Its parsed contents.
 */
function own(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url).pathname, "utf8"),
  ) as Record<string, unknown>;
}

test("names the package from the manifest beside the config", () => {
  const held = definedBy(packaged({ name: "@acme/thing", version: "1.2.3" }));

  expect(held["__NAME__"]).toBe('"@acme/thing"');
  expect(held["__VERSION__"]).toBe('"1.2.3"');
});

test("quotes every value, because a substitution is text rather than an expression", () => {
  const held = definedBy(packaged({ name: "@acme/thing", version: "1.2.3" }));

  for (const value of Object.values(held)) expect(value.startsWith('"')).toBe(true);
});

test("answers an empty string where there is no manifest to read", () => {
  expect(definedBy(packaged())["__NAME__"]).toBe('""');
});

test("answers an empty string where the manifest does not say", () => {
  expect(definedBy(packaged({ name: "@acme/thing" }))["__VERSION__"]).toBe('""');
});

test("answers an empty string where the field is not text", () => {
  expect(definedBy(packaged({ name: "@acme/thing", version: 3 }))["__VERSION__"]).toBe('""');
});

test("leaves out what was not asked for", () => {
  const held = definedBy(packaged({ name: "@acme/thing", version: "1.2.3" }));

  expect(Object.keys(held).toSorted()).toEqual(["__NAME__", "__VERSION__"]);
});

test("reads the revision from the environment the build runs in", () => {
  const before = process.env["GITHUB_SHA"];

  process.env["GITHUB_SHA"] = "cafe1234";
  try {
    expect(definedBy(packaged({}), { commit: true })["__COMMIT__"]).toBe('"cafe1234"');
  } finally {
    if (before === undefined) delete process.env["GITHUB_SHA"];
    else process.env["GITHUB_SHA"] = before;
  }
});

test("timestamps the build where it asks to be timestamped", () => {
  const held = definedBy(packaged({}), { builtAt: true });

  expect(held["__BUILT_AT__"]).toMatch(/^"\d{4}-\d{2}-\d{2}T/u);
});

test("declares every constant it injects, so that reading one type-checks", () => {
  const injected = Object.keys(definedBy(packaged({}), { builtAt: true, commit: true }));

  expect(declared().toSorted()).toEqual(injected.toSorted());
});

test("publishes the declarations under the subpath a package reaches them by", () => {
  const exported = own()["exports"] as Record<string, unknown>;

  expect(exported[SUBPATH], `the packer dropped ${SUBPATH} from exports`).toBe("./globals.d.ts");
});

test("publishes them after packing too, where a consumer reads them from", () => {
  const published = (own()["publishConfig"] as Record<string, unknown>)["exports"];

  expect((published as Record<string, unknown>)[SUBPATH]).toBe("./globals.d.ts");
});
