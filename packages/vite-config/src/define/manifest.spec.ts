import { readFileSync } from "node:fs";
import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { type Manifest } from "@stealthscale/vite-config-core";

import { type Injected, manifest } from "#define/manifest.ts";
import { answered } from "#vite.fixtures.ts";

function definedBy(
  stated: Manifest,
  injected: Injected = {},
  env: Record<string, string> = {},
): Record<string, string> {
  const held = answered(manifest(injected), { env, manifest: stated }) as UserConfig;

  return held.define as Record<string, string>;
}

const SUBPATH = "./globals";

function declared(): string[] {
  const source = readFileSync(new URL("../../globals.d.ts", import.meta.url).pathname, "utf8");

  return [...source.matchAll(/declare const (\S+):/gu)].map(([, name]) => name ?? "");
}

function own(): Record<string, unknown> {
  return JSON.parse(
    readFileSync(new URL("../../package.json", import.meta.url).pathname, "utf8"),
  ) as Record<string, unknown>;
}

describe("manifest", () => {
  it("names the package from the manifest the layer was handed", () => {
    const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

    expect(held["__NAME__"]).toBe('"@acme/thing"');
    expect(held["__VERSION__"]).toBe('"1.2.3"');
  });

  it("quotes every value", () => {
    const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

    for (const value of Object.values(held)) expect(value.startsWith('"')).toBe(true);
  });

  it("returns an empty string when there is no manifest to read", () => {
    expect(definedBy({})["__NAME__"]).toBe('""');
  });

  it("returns an empty string when the manifest omits the field", () => {
    expect(definedBy({ name: "@acme/thing" })["__VERSION__"]).toBe('""');
  });

  it("leaves out what was not asked for", () => {
    const held = definedBy({ name: "@acme/thing", version: "1.2.3" });

    expect(Object.keys(held).toSorted()).toStrictEqual(["__NAME__", "__VERSION__"]);
  });

  it("reads the revision from the environment the build runs in", () => {
    const held = definedBy({}, { commit: true }, { GITHUB_SHA: "cafe1234" });

    expect(held["__COMMIT__"]).toBe('"cafe1234"');
  });

  it("reads the other spelling when that is the one the runner sets", () => {
    const held = definedBy({}, { commit: true }, { CI_COMMIT_SHA: "beef5678" });

    expect(held["__COMMIT__"]).toBe('"beef5678"');
  });

  it("returns an empty string when there is no repository to read", () => {
    expect(definedBy({}, { commit: true })["__COMMIT__"]).toBe('""');
  });

  it("timestamps the build when asked to", () => {
    expect(definedBy({}, { builtAt: true })["__BUILT_AT__"]).toMatch(/^"\d{4}-\d{2}-\d{2}T/u);
  });

  it("names the layer for the constants beyond the two always injected", () => {
    expect(manifest().name).toBe("define.manifest");
    expect(manifest({ commit: true }).name).toBe("define.manifest(commit)");
    expect(manifest({ builtAt: true, commit: true }).name).toBe("define.manifest(commit, builtAt)");
  });

  it("declares every constant it injects", () => {
    const injected = Object.keys(definedBy({}, { builtAt: true, commit: true }));

    expect(declared().toSorted()).toStrictEqual(injected.toSorted());
  });

  it("publishes the declarations under the subpath a package reaches them by", () => {
    const exported = own()["exports"] as Record<string, unknown>;

    expect(exported[SUBPATH], `the packer dropped ${SUBPATH} from exports`).toBe("./globals.d.ts");
  });

  it("publishes the declarations after packing where a consumer reads them", () => {
    const published = (own()["publishConfig"] as Record<string, unknown>)["exports"];

    expect((published as Record<string, unknown>)[SUBPATH]).toBe("./globals.d.ts");
  });
});
