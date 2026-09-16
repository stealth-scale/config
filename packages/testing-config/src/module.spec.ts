import { describe, expect, it } from "vitest";

import { callable, factories, prefixOf, record, walked } from "#module.ts";

/**
 * A barrel with one of everything a config package exports.
 */
const BARREL = {
  contribute: (): string => "kernel",
  layers: (): string[] => [],
  lint: {
    preset: { node: (): string[] => [] },
    relax: (stated: unknown): unknown => stated,
    RULES: { a: 1 },
  },
  SOURCE: "stealth-source",
  version: "1.0.0",
};

describe("module", () => {
  it("returns true for a function and false for anything else", () => {
    expect(callable(record)).toBe(true);
    expect(callable({})).toBe(false);
  });

  it("returns true for a plain object and false for an array or null", () => {
    expect(record({})).toBe(true);
    expect(record([])).toBe(false);
    expect(record(null)).toBe(false);
  });

  it("collects each function in a namespace as a factory named by its path", () => {
    const paths = walked(BARREL, {}).factories.map((factory) => factory.path);

    expect(paths).toStrictEqual(["layers", "lint.preset.node", "lint.relax"]);
  });

  it("collects a top-level function when the specification supplies its arguments", () => {
    const paths = walked(BARREL, { contribute: [] }).factories.map((factory) => factory.path);

    expect(paths).toContain("contribute");
  });

  it("lists the top-level namespaces and leaves constants out", () => {
    expect(walked(BARREL, {}).namespaces).toStrictEqual(["lint"]);
  });

  it("reports an export that is neither a function nor a namespace nor a constant", () => {
    expect(walked(BARREL, {}).violations).toStrictEqual([
      "version is neither a function, a namespace nor a constant",
    ]);
  });

  it("reports such an export inside a namespace by its path", () => {
    const barrel = { lint: { level: 3 } };

    expect(walked(barrel, {}).violations).toStrictEqual([
      "lint.level is neither a function, a namespace nor a constant",
    ]);
  });

  it("reports a factory with required parameters and no arguments entry", () => {
    expect(factories(walked(BARREL, {}), {})).toContain(
      "lint.relax has required parameters and no entry in arguments",
    );
  });

  it("accepts a factory with required parameters when arguments are supplied", () => {
    expect(factories(walked({ lint: BARREL.lint }, {}), { "lint.relax": [{}] })).toStrictEqual([]);
  });

  it("carries the walk violations into the factories check", () => {
    expect(factories(walked({ version: "1" }, {}), {})).toHaveLength(1);
  });

  it.each([
    ["@stealthscale/vite-config", ""],
    ["@stealthscale/vite-config-react", "react"],
    ["@stealthscale/vite-plugin-sbom", "sbom"],
    ["vite-config-css", "css"],
    ["@acme/other", "other"],
  ])("derives the prefix of %s", (name, prefix) => {
    expect(prefixOf(name)).toBe(prefix);
  });
});
