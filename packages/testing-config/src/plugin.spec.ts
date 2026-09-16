import { describe, expect, it } from "vitest";

import { named, peer } from "#plugin.ts";

function plugin(name: string): Record<string, unknown> {
  return { configResolved: hook, generateBundle: hook, name };
}

function hook(): undefined {
  return undefined;
}

function hookless(): Record<string, unknown> {
  return { name: "stealth:sbom" };
}

function factory(name: string): () => Record<string, unknown> {
  return () => plugin(name);
}

describe("plugin", () => {
  it("accepts a barrel whose factory returns a plugin named for it", () => {
    expect(named({ sbom: factory("stealth:sbom") }, {})).toStrictEqual([]);
  });

  it("reports a barrel with no function that returns a plugin", () => {
    expect(named({ VERSION: "1", written: (): string => "x" }, {})).toStrictEqual([
      "no export returns a plugin",
    ]);
  });

  it("reports a plugin named for something other than its factory", () => {
    expect(named({ sbom: factory("sbom") }, {})).toStrictEqual([
      "sbom returns a plugin named sbom, not stealth:sbom",
    ]);
  });

  it("reports a plugin without the two hooks of the house base", () => {
    expect(named({ sbom: hookless }, {})).toStrictEqual([
      "sbom returns a plugin without configResolved",
      "sbom returns a plugin without generateBundle",
    ]);
  });

  it("calls a factory with the supplied arguments", () => {
    const barrel = { sbom: (name: unknown): Record<string, unknown> => plugin(String(name)) };

    expect(named(barrel, { sbom: ["stealth:sbom"] })).toStrictEqual([]);
  });

  it("leaves a helper with required parameters alone", () => {
    const barrel = { sbom: factory("stealth:sbom"), written: (text: string): string => text };

    expect(named(barrel, {})).toStrictEqual([]);
  });

  it("reports a factory that throws", () => {
    const barrel = {
      sbom: (): never => {
        throw new Error("no bundle");
      },
    };

    expect(named(barrel, {})).toStrictEqual([
      "sbom throws when called: no bundle",
      "no export returns a plugin",
    ]);
  });

  it("accepts a manifest that peers on vite", () => {
    expect(peer({ name: "x", peerDependencies: { vite: "catalog:peer" } })).toStrictEqual([]);
  });

  it("reports a manifest without a vite peer", () => {
    expect(peer({ name: "x" })).toStrictEqual(["a plugin package peers on nothing named vite"]);
  });
});
