import { readFileSync } from "node:fs";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { type Manifest } from "@stealthscale/vite-config-core";

import { type Injected, manifest } from "#define/manifest.ts";
import { answered } from "#vite.fixtures.ts";

/**
 * Reads back the constants a config would be built with.
 *
 * @param stated - What the package's own manifest holds.
 * @param injected - What to ask for beyond the two always given.
 * @param env - The variables the build runs in.
 * @returns Each constant's name against the text it is replaced by.
 */
function definedBy(
  stated: Manifest,
  injected: Injected = {},
  env: Record<string, string> = {},
): Record<string, string> {
  const held = answered(manifest(injected), { env, manifest: stated }) as UserConfig;

  return held.define as Record<string, string>;
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

test("names the package from the manifest the layer was handed", () => {
  const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

  expect(held["__NAME__"]).toBe('"@acme/thing"');
  expect(held["__VERSION__"]).toBe('"1.2.3"');
});

test("quotes every value, because a substitution is text rather than an expression", () => {
  const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

  for (const value of Object.values(held)) expect(value.startsWith('"')).toBe(true);
});

test("answers an empty string where there was no manifest to read", () => {
  expect(definedBy({})["__NAME__"]).toBe('""');
});

test("answers an empty string where the manifest does not say", () => {
  expect(definedBy({ name: "@acme/thing" })["__VERSION__"]).toBe('""');
});

test("leaves out what was not asked for", () => {
  const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

  expect(Object.keys(held).toSorted()).toEqual(["__NAME__", "__VERSION__"]);
});

test("reads the revision from the environment the build runs in", () => {
  const held = definedBy({}, { commit: true }, { GITHUB_SHA: "cafe1234" });

  expect(held["__COMMIT__"]).toBe('"cafe1234"');
});

test("takes the other spelling where that is the one the runner sets", () => {
  const held = definedBy({}, { commit: true }, { CI_COMMIT_SHA: "beef5678" });

  expect(held["__COMMIT__"]).toBe('"beef5678"');
});

test("answers an empty string where there is no repository to ask", () => {
  expect(definedBy({}, { commit: true })["__COMMIT__"]).toBe('""');
});

test("timestamps the build where it asks to be timestamped", () => {
  expect(definedBy({}, { builtAt: true })["__BUILT_AT__"]).toMatch(/^"\d{4}-\d{2}-\d{2}T/u);
});

test("declares every constant it injects, so that reading one type-checks", () => {
  const injected = Object.keys(definedBy({}, { builtAt: true, commit: true }));

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
